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
 * File name:         kafka.broker.ts
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
import { KafkaClient } from '../client';
import { BaseBroker } from './base.broker';
import { ProvidersConstants } from '../event-store.constant';
import { EachMessagePayload, Message } from '../external/kafka.types';
import {
  EventStoreFeatureOptions,
  ExtendedKafkaStandardSubscription,
  KafkaSubscription,
} from '../interface/feature.options';

@Injectable()
export class KafkaBroker
  extends BaseBroker
  implements IEventPublisher, OnModuleInit, IMessageSource {
  private standardSubscriptions: ExtendedKafkaStandardSubscription[] = [];
  private standardSubscriptionsCount: number;

  constructor(
    private readonly kafka: KafkaClient,
    @Inject(ProvidersConstants.EVENT_STORE_FEATURE_CONFIG)
    private readonly featureStreamConfig: EventStoreFeatureOptions,
    private readonly eventsBus: EventBus
  ) {
    super(featureStreamConfig, KafkaBroker.name);
    this.watchClient();
  }

  private watchClient() {
    this.kafka.on('connected', async () => {
      await this.init(this.featureStreamConfig);
    });
  }

  private async init(featureStreamConfig: EventStoreFeatureOptions) {
    if (!this.kafka.connected) {
      await this.kafka.connect();
    }

    const subs = (featureStreamConfig.subscriptions ||
      []) as KafkaSubscription[];

    if (subs.length > 0) {
      this.subscribeToStandardSubscriptions(subs);
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

  get isLive(): boolean {
    return this.allStandardSubscriptionsLive;
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.subject$ = subject;
  }

  async onModuleInit() {
    this.subject$ = (this.eventsBus as any).subject$;
    this.bridgeEventsTo((this.eventsBus as any).subject$);
    this.eventsBus.publisher = this;
  }

  private createPayloads(events: any[]): Map<string, Message[]> {
    const messages = new Map<string, Message[]>();

    for (const event of events) {
      const payload = Buffer.from(JSON.stringify(event));
      let streamId = this.getStreamId(this.streamName);
      if (!this.featureStreamConfig.strictStreamName) {
        streamId = this.getStreamId(event.streamName ?? this.streamName);
      }

      if (messages.has(streamId)) {
        messages.get(streamId).push({ value: payload, headers: {eventType: event.constructor.name} });
      } else {
        messages.set(streamId, [{ value: payload, headers: {eventType: event.constructor.name} }]);
      }
    }

    return messages;
  }

  async publish<T extends IEvent & { streamName?: string }>(event: T) {
    return this.publishAll([event]);
  }

  async publishAll<T extends IEvent & { streamName?: string }>(events: T[]) {
    if ((events || []).length === 0) {
      return;
    }

    try {
      const promises = [];
      const payloads = this.createPayloads(events);

      for (const key in payloads) {
        promises.push(
          this.kafka.producer.send({
            topic: key,
            messages: payloads.get(key),
          })
        );
      }

      await Promise.all(promises);
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async subscribeToStandardSubscription(
    opts: Omit<KafkaSubscription, 'type'>
  ): Promise<ExtendedKafkaStandardSubscription> {
    this.logger.log(
      `Standard subscription subscribing to topic [${opts.topic}]`
    );

    try {
      await this.kafka.consumer.subscribe(opts);

      await this.kafka.consumer.run({
        eachMessage: async (payload) => {
          await this.handleEvent(payload);
        },
      });

      const resolved = opts as ExtendedKafkaStandardSubscription;

      /*
        .on('message', (event) => this.handleEvent(event))
        .on('ready', () => this.onLiveProcessingStarted())
        .on('error', (error) => this.handleError(error))
        .on('unsubscribed', (error) => this.handleError(error))
        .on('closed', (error) =>
          this.handleError(error)
        )) as ExtendedKafkaStandardSubscription;
       */
      resolved.isLive = true;
      return resolved;
    } catch (err) {
      this.logger.error(err);
    }
  }

  private async subscribeToStandardSubscriptions(
    subscriptions: KafkaSubscription[]
  ) {
    if (!this.kafka.connected) {
      return;
    }

    this.standardSubscriptionsCount = subscriptions.length;
    this.standardSubscriptions = await Promise.all(
      subscriptions.map(async (subscription) => {
        return await this.subscribeToStandardSubscription({
          ...subscription,
          topic: this.getStreamId(subscription.topic),
        });
      })
    );
  }

  private async handleEvent(payload: EachMessagePayload) {
    try {
      if (!payload) {
        this.logger.error('Received event that could not be resolved!');
        return;
      }

      const data = JSON.parse(payload.message.value.toString());
      const eventType = (payload.message.headers["eventType"] ?? payload.topic) as string;

      const handler = this.eventHandlers[eventType];
      if (!handler) {
        this.logger.error('Received event that could not be handled!');
        return;
      }

      if (this.eventHandlers && this.eventHandlers[eventType]) {
        this.subject$.next(this.eventHandlers[eventType](data));
        if (this.featureStreamConfig.notify?.ignoreAck) {
          return;
        }
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
