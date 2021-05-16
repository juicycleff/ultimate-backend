/*******************************************************************************
 * Copyright (c) 2021. Rex Isaac Raphael
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * File name:         stan.broker.ts
 * Last modified:     14/02/2021, 17:24
 ******************************************************************************/
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  EventBus,
  IEvent,
  IEventPublisher,
  IMessageSource,
} from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import {
  EventStoreFeatureOptions,
  StanPersistentSubscription,
  StanStandardSubscription,
  EventStoreSubscriptionType,
  ExtendedStanPersistentSubscription,
  ExtendedStanStandardSubscription,
  StanSubscription,
} from '@ultimate-backend';
import { StanClient } from '../client';
import { BaseBroker } from './base.broker';
import { ProvidersConstants } from '../event-store.constant';
import { Message } from '../external/stan.types';

@Injectable()
export class StanBroker
  extends BaseBroker
  implements IEventPublisher, OnModuleInit, IMessageSource {
  private persistentSubscriptions: ExtendedStanPersistentSubscription[] = [];
  private persistentSubscriptionsCount: number;

  private standardSubscriptions: ExtendedStanStandardSubscription[] = [];
  private standardSubscriptionsCount: number;

  constructor(
    private readonly stan: StanClient,
    @Inject(ProvidersConstants.EVENT_STORE_FEATURE_CONFIG)
    private readonly featureStreamConfig: EventStoreFeatureOptions,
    private readonly eventsBus: EventBus
  ) {
    super(featureStreamConfig, StanBroker.name);
    this.watchClient();
  }

  private watchClient() {
    this.stan.on('connected', async () => {
      await this.init(this.featureStreamConfig);
    });
  }

  private async init(featureStreamConfig: EventStoreFeatureOptions) {
    if (!this.stan.connected) {
      await this.stan.connect();
    }

    const subs = (featureStreamConfig.subscriptions ||
      []) as StanSubscription[];

    if (subs.length > 0) {
      const persistentSubscriptions = subs.filter((sub) => {
        return sub.type === EventStoreSubscriptionType.Persistent;
      });
      const standardSubscriptions = subs.filter((sub) => {
        return sub.type === EventStoreSubscriptionType.Standard;
      });

      this.subscribeToPersistentSubscriptions(
        persistentSubscriptions as StanPersistentSubscription[]
      );
      this.subscribeToStandardSubscriptions(
        standardSubscriptions as StanStandardSubscription[]
      );
    }
  }

  get allStandardSubscriptionsLive(): boolean {
    const initialized =
      this.standardSubscriptions.length === this.standardSubscriptionsCount;
    return (
      initialized &&
      this.standardSubscriptions.every((subscription) => {
        return !!subscription && subscription.isLive;
      })
    );
  }

  get allPersistentSubscriptionsLive(): boolean {
    const initialized =
      this.persistentSubscriptions.length === this.persistentSubscriptionsCount;
    return (
      initialized &&
      this.persistentSubscriptions.every((subscription) => {
        return !!subscription && subscription.isLive;
      })
    );
  }

  get isLive(): boolean {
    return (
      this.allPersistentSubscriptionsLive && this.allStandardSubscriptionsLive
    );
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.subject$ = subject;
  }

  async onModuleInit() {
    this.subject$ = (this.eventsBus as any).subject$;
    this.bridgeEventsTo((this.eventsBus as any).subject$);
    this.eventsBus.publisher = this;
  }

  async publish<T extends IEvent & { streamName?: string }>(event: T) {
    if (!event) {
      return;
    }

    const payload = Buffer.from(JSON.stringify(event));
    let streamId = this.getStreamId(this.streamName);
    if (!this.featureStreamConfig.strictStreamName) {
      streamId = this.getStreamId(event.streamName ?? this.streamName);
    }

    try {
      await this.stan.client().publish(streamId, payload);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async publishAll<T extends IEvent & { streamName?: string }>(events: T[]) {
    if ((events || []).length === 0) {
      return;
    }

    try {
      for (const event of events) {
        const payload = Buffer.from(JSON.stringify(event));
        let streamId = this.getStreamId(this.streamName);
        if (!this.featureStreamConfig.strictStreamName) {
          streamId = this.getStreamId(event.streamName ?? this.streamName);
        }
        await this.stan.client().publish(streamId, payload);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async subscribeToPersistentSubscription(
    opts: Omit<StanPersistentSubscription, 'type'>
  ): Promise<ExtendedStanPersistentSubscription> {
    try {
      this.logger.log(`
       Connecting to persistent subscription group [${opts.groupName}] on stream [${opts.streamName}]!
      `);

      const resolved = (await this.stan
        .client()
        .subscribe(opts.streamName, opts.groupName, opts.options)
        .on('message', (event) => this.handleEvent(event))
        .on('ready', () => this.onLiveProcessingStarted())
        .on('error', (error) => this.handleError(error))
        .on('unsubscribed', (error) => this.handleError(error))
        .on('close', (error) =>
          this.handleError(error)
        )) as ExtendedStanPersistentSubscription;
      resolved.isLive = true;

      return resolved;
    } catch (err) {
      this.logger.error(err.message);
    }
  }

  private async subscribeToStandardSubscription(
    opts: Omit<StanStandardSubscription, 'type'>
  ): Promise<ExtendedStanStandardSubscription> {
    this.logger.log(
      `Standard subscription subscribing to stream [${opts.streamName}]`
    );
    try {
      const resolved = (await this.stan
        .client()
        .subscribe(opts.streamName, opts.options)
        .on('message', (event) => this.handleEvent(event))
        .on('ready', () => this.onLiveProcessingStarted())
        .on('error', (error) => this.handleError(error))
        .on('unsubscribed', (error) => this.handleError(error))
        .on('closed', (error) =>
          this.handleError(error)
        )) as ExtendedStanStandardSubscription;

      resolved.isLive = true;
      return resolved;
    } catch (err) {
      this.logger.error(err);
    }
  }

  private async subscribeToPersistentSubscriptions(
    subscriptions: StanPersistentSubscription[]
  ) {
    if (!this.stan.connected) {
      return;
    }

    this.persistentSubscriptionsCount = subscriptions.length;
    this.persistentSubscriptions = await Promise.all(
      subscriptions.map(async (subscription) => {
        return await this.subscribeToPersistentSubscription({
          streamName: this.getStreamId(subscription.streamName),
          groupName: subscription.groupName,
          options: subscription.options,
        });
      })
    );
  }

  private async subscribeToStandardSubscriptions(
    subscriptions: StanStandardSubscription[]
  ) {
    if (!this.stan.connected) {
      return;
    }

    this.standardSubscriptionsCount = subscriptions.length;
    this.standardSubscriptions = await Promise.all(
      subscriptions.map(async (subscription) => {
        let startPosition;
        if (this.store) {
          startPosition = await this.store.read(
            `${this.store.storePrefix} ${subscription.streamName}`
          );
        } else if (subscription.options) {
          startPosition = subscription.options.startPosition;
        }

        return await this.subscribeToStandardSubscription({
          streamName: this.getStreamId(subscription.streamName),
          options: {
            ...subscription.options,
            startPosition,
          },
        });
      })
    );
  }

  private async handleEvent(payload: Message) {
    try {
      if (!payload) {
        this.logger.error('Received event that could not be resolved!');
        return;
      }

      const data: any & { handlerType?: string } = JSON.parse(
        payload.getRawData().toString()
      );
      const eventType = payload.getSubject();

      const handler = this.eventHandlers[eventType];
      if (!handler) {
        this.logger.error('Received event that could not be handled!');
        return;
      }

      if (this.eventHandlers && this.eventHandlers[eventType]) {
        this.subject$.next(this.eventHandlers[eventType](data));
        if (this.store) {
          await this.store.write(
            `${this.store.storePrefix} ${payload.getSubject()}`,
            payload.getSequence()
          );
        }

        if (this.featureStreamConfig.notify?.ignoreAck) {
          return;
        }

        payload.ack();
      } else {
        this.logger.warn(`Event of type ${eventType} not handled`);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  private handleError(error: Error) {
    this.logger.error('onDropped => ' + error.message);
  }
}
