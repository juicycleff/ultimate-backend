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
import {
  EventStoreFeatureOptions,
  EventStoreSubscriptionType,
  ExtendedPersistentSubscription,
  ExtendedPubsubStandardSubscription,
  ExtendedStandardSubscription,
  GooglePubsubBrokerFeature,
  GooglePubsubSubscription,
} from '../interface';
import { ResolvedEvent } from '@eventstore/db-client';
import { ProvidersConstants } from '../event-store.constant';
import { BaseBroker } from './base.broker';
import { GooglePubsubClient } from '../client';
import { Topic } from '../external/gpubsub.types';

@Injectable()
export class GooglePubsubBroker
  extends BaseBroker
  implements IEventPublisher, OnModuleInit, IMessageSource {
  private standardSubscriptions: ExtendedPubsubStandardSubscription[] = [];
  private standardSubscriptionsCount: number;

  private _cachedTopics = new Map<string, Topic>();
  /**
   * Construct an {EventStoreBroker}
   * Parameters are automatically injected
   *
   * @param pubsubClient {EventStoreClient}
   * @param featureStreamConfig {EventStoreFeatureOptions}
   * @param eventsBus {EventBus}
   */
  constructor(
    private readonly pubsubClient: GooglePubsubClient,
    @Inject(ProvidersConstants.EVENT_STORE_FEATURE_CONFIG)
    private readonly featureStreamConfig: EventStoreFeatureOptions,
    private readonly eventsBus: EventBus
  ) {
    super(featureStreamConfig, GooglePubsubBroker.name);
  }

  private async init(featureStreamConfig: EventStoreFeatureOptions) {
    if (!this.pubsubClient.connected) {
      await this.pubsubClient.connect();
    }

    const subs = (featureStreamConfig.subscriptions ||
      []) as GooglePubsubSubscription[];

    if (subs.length > 0) {
      const standardSubscriptions = subs.filter((sub) => {
        return sub.type === EventStoreSubscriptionType.Standard;
      });

      this.subscribeToStandardSubscriptions(
        standardSubscriptions as GooglePubsubSubscription[]
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

  get isLive(): boolean {
    return this.allStandardSubscriptionsLive;
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.subject$ = subject;
  }

  async onModuleInit() {
    await this.init(this.featureStreamConfig);
    this.subject$ = (this.eventsBus as any).subject$;
    this.bridgeEventsTo((this.eventsBus as any).subject$);
    this.eventsBus.publisher = this;
  }

  async publish<T extends IEvent & { streamName?: string }>(event: T) {
    if (!event) {
      return;
    }

    const config = this.featureStreamConfig as GooglePubsubBrokerFeature;

    let topicId = this.getStreamId(this.streamName);
    if (!config.strictStreamName) {
      topicId = this.getStreamId(event.streamName ?? this.streamName);
    }

    const eventPayload = {
      id: uuid.v4(),
      type: event.constructor.name,
      data: event,
    };

    let topic: Topic;

    try {
      topic = await this.pubsubClient.client().topic(topicId);

      if (!(await topic.exists()) && !this._cachedTopics.has(topicId)) {
        const [_topic] = await this.pubsubClient.client().createTopic(topicId);
        topic = _topic;
      }
    } catch (e) {
      const [_topic] = await this.pubsubClient.client().createTopic(topicId);
      topic = _topic;
    }

    if (this._cachedTopics.has(topicId)) {
      this._cachedTopics.set(topicId, topic);
    }

    try {
      await topic.publishJSON(eventPayload, {
        originalEvenType: event.constructor.name,
      });
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
        await this.publish(event);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async subscribeToStandardSubscription(
    opts: Omit<GooglePubsubSubscription, 'type'>
  ): Promise<ExtendedPubsubStandardSubscription> {
    this.logger.log(
      `Standard subscription subscribing to topic [${opts.topicName}] with subscription [${opts.subscriptionName}]`
    );

    let topic;
    let subscription: ExtendedPubsubStandardSubscription;

    try {
      topic = await this.pubsubClient.client().topic(opts.topicName);

      if (!(await topic.exists()) && !this._cachedTopics.has(opts.topicName)) {
        const [_topic] = await this.pubsubClient
          .client()
          .createTopic(opts.topicName);
        topic = _topic;
      }
    } catch (e) {
      const [_topic] = await this.pubsubClient
        .client()
        .createTopic(opts.topicName);
      topic = _topic;
    }

    if (this._cachedTopics.has(opts.topicName)) {
      this._cachedTopics.set(opts.topicName, topic);
    }

    try {
      subscription = (await this.pubsubClient
        .client()
        .subscription(
          opts.subscriptionName
        )) as ExtendedPubsubStandardSubscription;
    } catch (e) {
      const [
        _subscription,
      ] = await this.pubsubClient
        .client()
        .createSubscription(topic, opts.subscriptionName, opts.options);
      subscription = _subscription as ExtendedPubsubStandardSubscription;
    }

    try {
      subscription.on('message', (message) => this.handleEvent(message));

      subscription.on('confirmation', () => this.onLiveProcessingStarted());

      subscription.on('error', (error) => this.handleError(null, error));

      subscription.on('close', (error) => this.handleError(null, error));

      subscription.isLive = true;
      return subscription;
    } catch (err) {
      this.logger.error(err);
    }
  }

  private async subscribeToStandardSubscriptions(
    subscriptions: GooglePubsubSubscription[]
  ) {
    if (!this.pubsubClient.connected) {
      return;
    }

    this.standardSubscriptionsCount = subscriptions.length;
    this.standardSubscriptions = await Promise.all(
      subscriptions.map(async (subscription) => {
        return await this.subscribeToStandardSubscription({
          subscriptionName: this.getStreamId(subscription.subscriptionName),
          topicName: subscription.topicName,
          options: subscription.options,
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
