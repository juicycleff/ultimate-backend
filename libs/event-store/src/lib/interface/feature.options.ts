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
 * File name:         feature.options.ts
 * Last modified:     14/02/2021, 18:29
 ******************************************************************************/
import { EventStoreBrokerTypes } from './broker.enums';
import { IAdapterStore } from '../adapter.interface';
import { IEvent } from '@nestjs/cqrs';
import { ModuleMetadata, Type } from '@nestjs/common';
import { DuplexOptions, ReadableOptions } from 'stream';
import { ConnectToPersistentSubscriptionOptions } from '@eventstore/db-client/dist/persistentSubscription';
import {
  EventType,
  PersistentSubscription,
  StreamSubscription,
} from '@eventstore/db-client/dist/types';
import { AppendToStreamOptions, SubscribeToStreamOptions } from '@eventstore/db-client/dist/streams';
import { Subscription, SubscriptionOptions } from '../external/stan.types';
import { CreateSubscriptionOptions, Subscription as PubsubSubscription } from '../external/gpubsub.types';
import { ConsumerSubscribeTopic } from '../external/kafka.types';

export interface IEventConstructors {
  [key: string]: (...args: any[]) => IEvent;
}

/***************************Event Store*********************/
export enum EventStoreSubscriptionType {
  Persistent,
  Standard,
}

export interface EventStoreStandardSubscription {
  type: EventStoreSubscriptionType.Standard;
  streamName: string;
  options?: SubscribeToStreamOptions;
  readableOptions?: ReadableOptions;
}

export interface EventStorePersistentSubscription {
  type: EventStoreSubscriptionType.Persistent;
  streamName: string;
  groupName: string;
  options?: ConnectToPersistentSubscriptionOptions;
  duplexOptions?: DuplexOptions;
}

export type EventStoreSubscription =
  | EventStorePersistentSubscription
  | EventStoreStandardSubscription;

/***********************Nats Streaming***********************/
export interface BaseStanSubscription {
  options?: SubscriptionOptions;
  streamName: string;
}

export interface StanPersistentSubscription extends BaseStanSubscription {
  type: EventStoreSubscriptionType.Persistent;
  groupName: string;
}

export interface StanStandardSubscription extends BaseStanSubscription {
  type: EventStoreSubscriptionType.Standard;
}

export type StanSubscription = StanPersistentSubscription | StanStandardSubscription;

/***********************Google PubSub***********************/

export interface GooglePubsubSubscription {
  type: EventStoreSubscriptionType.Standard;
  topicName: string;
  subscriptionName: string;
  options?: CreateSubscriptionOptions;
}

/*********************** Kafka ***********************/

export type KafkaSubscription = ConsumerSubscribeTopic

/***********************Real***********************/

export interface BaseBrokerFeatureOption {
  streamName?: string;
  store?: IAdapterStore;
  eventHandlers: IEventConstructors;
  strictStreamName?: boolean;
  notify?: {
    ignoreAck?: boolean;
    ignoreNack?: boolean;
  }
}

export interface EventStoreBrokerFeature extends BaseBrokerFeatureOption {
  type: EventStoreBrokerTypes.EventStore;
  subscriptions: EventStoreSubscription[];
  options?: AppendToStreamOptions
}

export interface StanBrokerFeature extends BaseBrokerFeatureOption {
  type: EventStoreBrokerTypes.Stan;
  subscriptions: StanSubscription[];
}

export interface GooglePubsubBrokerFeature extends BaseBrokerFeatureOption {
  type: EventStoreBrokerTypes.GooglePubSub;
  streamName: string;
  subscriptions: GooglePubsubSubscription[];
}

export interface KafkaBrokerFeature extends BaseBrokerFeatureOption {
  type: EventStoreBrokerTypes.Kafka;
  streamName: string;
  subscriptions: KafkaSubscription[];
}

export interface ExtendedPersistentSubscription<E extends EventType = EventType>
  extends PersistentSubscription<E> {
  type: 'persistent';
  isLive?: boolean | undefined;
}

export interface ExtendedStandardSubscription<E extends EventType = EventType>
  extends StreamSubscription<E> {
  type: 'normal';
  isLive?: boolean | undefined;
}

export interface ExtendedStanPersistentSubscription extends Subscription {
  type: 'persistent';
  isLive?: boolean | undefined;
}

export interface ExtendedStanStandardSubscription extends Subscription {
  type: 'normal';
  isLive?: boolean | undefined;
}

export interface ExtendedPubsubStandardSubscription extends PubsubSubscription {
  type: 'normal';
  isLive?: boolean | undefined;
}

export interface ExtendedKafkaStandardSubscription extends KafkaSubscription {
  type: 'normal';
  isLive?: boolean | undefined;
}

export type EventStoreFeatureOptions =
  | EventStoreBrokerFeature
  | GooglePubsubBrokerFeature
  | StanBrokerFeature
  | KafkaBrokerFeature;

export interface EventStoreFeatureOptionsFactory {
  createFeatureOptions(
    connectionName?: string
  ): Promise<EventStoreFeatureOptions> | EventStoreFeatureOptions;
}

export interface EventStoreFeatureAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  type: EventStoreBrokerTypes;
  useExisting?: Type<EventStoreFeatureOptionsFactory>;
  useClass?: Type<EventStoreFeatureOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<EventStoreFeatureOptions> | EventStoreFeatureOptions;
  inject?: any[];
}
