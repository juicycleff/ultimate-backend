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
  PersistentSubscription, StreamSubscription,
} from '@eventstore/db-client/dist/types';
import { AppendToStreamOptions, SubscribeToStreamOptions } from '@eventstore/db-client/dist/streams';
import { Subscription, SubscriptionOptions } from '../external/stan.types';

export interface IEventConstructors {
  [key: string]: (...args: any[]) => IEvent;
}

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
  type: EventStoreBrokerTypes.STAN;
  subscriptions: StanSubscription[];
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

export type EventStoreFeatureOptions =
  | EventStoreBrokerFeature
  | StanBrokerFeature;

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
