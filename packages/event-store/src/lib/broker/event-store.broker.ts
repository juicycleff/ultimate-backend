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
 * File name:         event-store.broker.ts
 * Last modified:     14/02/2021, 18:26
 ******************************************************************************/

import {
  EventBus,
  IEvent,
  IEventPublisher,
  IMessageSource,
} from '@nestjs/cqrs';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Subject } from 'rxjs';
import * as uuid from 'uuid';
import { EventStoreClient } from '../client';
import {
  EventStoreBrokerFeature,
  EventStoreFeatureOptions,
  EventStorePersistentSubscription,
  EventStoreStandardSubscription,
  EventStoreSubscription,
  EventStoreSubscriptionType,
  ExtendedPersistentSubscription,
  ExtendedStandardSubscription,
} from '../interface';
import { jsonEvent, JSONType, ResolvedEvent } from '@eventstore/db-client';
import { ProvidersConstants } from '../event-store.constant';
import { BaseBroker } from './base.broker';

@Injectable()
export class EventStoreBroker
  extends BaseBroker
  implements IEventPublisher, OnModuleInit, IMessageSource {
  private persistentSubscriptions: ExtendedPersistentSubscription[] = [];
  private persistentSubscriptionsCount: number;

  private standardSubscriptions: ExtendedStandardSubscription[] = [];
  private standardSubscriptionsCount: number;

  /**
   * Construct an {EventStoreBroker}
   * Parameters are automatically injected
   *
   * @param eventStore {EventStoreClient}
   * @param featureStreamConfig {EventStoreFeatureOptions}
   * @param eventsBus {EventBus}
   */
  constructor(
    private readonly eventStore: EventStoreClient,
    @Inject(ProvidersConstants.EVENT_STORE_FEATURE_CONFIG)
    private readonly featureStreamConfig: EventStoreFeatureOptions,
    private readonly eventsBus: EventBus
  ) {
    super(featureStreamConfig, EventStoreBroker.name);
    this.watchClient();
  }

  private watchClient() {
    this.eventStore.on('connected', async () => {
      await this.init(this.featureStreamConfig);
    });
  }

  private async init(featureStreamConfig: EventStoreFeatureOptions) {
    if (!this.eventStore.connected) {
      await this.eventStore.connect();
    }

    const subs = (featureStreamConfig.subscriptions ||
      []) as EventStoreSubscription[];

    if (subs.length > 0) {
      const persistentSubscriptions = subs.filter((sub) => {
        return sub.type === EventStoreSubscriptionType.Persistent;
      });
      const standardSubscriptions = subs.filter((sub) => {
        return sub.type === EventStoreSubscriptionType.Standard;
      });

      this.subscribeToPersistentSubscriptions(
        persistentSubscriptions as EventStorePersistentSubscription[]
      );
      this.subscribeToStandardSubscriptions(
        standardSubscriptions as EventStoreStandardSubscription[]
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

    const config = this.featureStreamConfig as EventStoreBrokerFeature;

    let streamId = this.getStreamId(this.streamName);
    if (!this.featureStreamConfig.strictStreamName) {
      streamId = this.getStreamId(event.streamName ?? this.streamName);
    }

    const eventPayload = jsonEvent({
      id: uuid.v4(),
      type: event.constructor.name,
      data: event as JSONType,
      metadata: {
        originalEvenType: event.constructor.name,
      },
    });
    try {
      await this.eventStore
        .client()
        .appendToStream(streamId, eventPayload, config.options);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async publishAll<T extends IEvent>(events: T[]) {
    if ((events || []).length === 0) {
      return;
    }
    const config = this.featureStreamConfig as EventStoreBrokerFeature;

    const payloadEvents = [];
    for (const event of events) {
      payloadEvents.push(
        jsonEvent({
          id: uuid.v4(),
          type: event.constructor.name,
          data: event as JSONType,
          metadata: {
            originalEvenType: event.constructor.name,
          },
        })
      );
    }

    try {
      await this.eventStore
        .client()
        .appendToStream(this.streamName, payloadEvents, config.options);
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async subscribeToPersistentSubscription(
    opts: Omit<EventStorePersistentSubscription, 'type'>
  ): Promise<ExtendedPersistentSubscription> {
    try {
      this.logger.log(`
       Connecting to persistent subscription group [${opts.groupName}] on stream [${opts.streamName}]!
      `);

      const resolved = (await this.eventStore
        .client()
        .subscribeToPersistentSubscriptionToStream(
          opts.streamName,
          opts.groupName,
          opts.options,
          opts.duplexOptions
        )
        .on('data', (event) => this.handleEvent(event))
        .on('error', (error) => this.handleError(null, error))
        .on('close', (error) =>
          this.handleError(null, error)
        )) as ExtendedPersistentSubscription;
      resolved.isLive = true;

      return resolved;
    } catch (err) {
      this.logger.error(err.message);
    }
  }

  private async subscribeToStandardSubscription(
    opts: Omit<EventStoreStandardSubscription, 'type'>
  ): Promise<ExtendedStandardSubscription> {
    this.logger.log(
      `Standard subscription subscribing to stream [${opts.streamName}]`
    );
    try {
      const resolved = (await this.eventStore
        .client()
        .subscribeToStream(opts.streamName, opts.options, opts.readableOptions)
        .on('data', (event) => this.handleEvent(event))
        .on('confirmation', () => this.onLiveProcessingStarted())
        .on('error', (error) => this.handleError(null, error))
        .on('close', (error) =>
          this.handleError(null, error)
        )) as ExtendedStandardSubscription;

      resolved.isLive = true;
      return resolved;
    } catch (err) {
      this.logger.error(err);
    }
  }

  private async subscribeToPersistentSubscriptions(
    subscriptions: EventStorePersistentSubscription[]
  ) {
    if (!this.eventStore.connected) {
      return;
    }

    this.persistentSubscriptionsCount = subscriptions.length;
    this.persistentSubscriptions = await Promise.all(
      subscriptions.map(async (subscription) => {
        return await this.subscribeToPersistentSubscription({
          streamName: this.getStreamId(subscription.streamName),
          groupName: subscription.groupName,
          options: subscription.options,
          duplexOptions: subscription.duplexOptions,
        });
      })
    );
  }

  private async subscribeToStandardSubscriptions(
    subscriptions: EventStoreStandardSubscription[]
  ) {
    if (!this.eventStore.connected) {
      return;
    }

    this.standardSubscriptionsCount = subscriptions.length;
    this.standardSubscriptions = await Promise.all(
      subscriptions.map(async (subscription) => {
        let fromRevision;
        if (this.store) {
          fromRevision = await this.store.read(
            `${this.store.storePrefix} ${subscription.streamName}`
          );
        } else if (subscription.options) {
          fromRevision = subscription.options.fromRevision;
        }

        return await this.subscribeToStandardSubscription({
          streamName: this.getStreamId(subscription.streamName),
          options: {
            ...subscription.options,
            fromRevision,
          },
          readableOptions: subscription.readableOptions,
        });
      })
    );
  }

  handleError(
    subscription: ExtendedPersistentSubscription | ExtendedStandardSubscription,
    error: Error
  ) {
    this.logger.error('onDropped => ' + error.message);
  }

  private async handleEvent(payload: ResolvedEvent) {
    try {
      const { event } = payload;

      if (!event || !event.isJson) {
        this.logger.error('Received event that could not be resolved!');
        return;
      }

      const handler = this.eventHandlers[event.type];
      if (!handler) {
        this.logger.error('Received event that could not be handled!');
        return;
      }

      const data = event.data;
      const eventType = event.type;
      if (this.eventHandlers && this.eventHandlers[eventType]) {
        this.subject$.next(this.eventHandlers[event.type](data));
        if (this.store) {
          await this.store.write(
            `${this.store.storePrefix} ${event.streamId}`,
            parseInt(payload.event.revision.toString(), 10)
          );
        }
      } else {
        this.logger.warn(`Event of type ${eventType} not handled`);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
}
