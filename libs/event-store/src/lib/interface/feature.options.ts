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

export interface IEventConstructors {
  [key: string]: (...args: any[]) => IEvent;
}

export enum EventStoreSubscriptionType {
  Persistent,
  Volatile
}

export interface EventStoreSubscription {
  type?: EventStoreSubscriptionType;
  fromStream: string;
  toStream: string;
  resolveLinkTos?: boolean;
  fromRevision?:  number | null | string;
}

export interface StanSubscription {
  type?: EventStoreSubscriptionType;
  stream: string;
  durableName: string;
  maxInflight?: number;
  startAt?: number;
  ackWait?: number,
  manualAcks?: boolean
}

export interface BaseBrokerFeatureOption {
  streamName?: string;
  store?: IAdapterStore;
  eventHandlers: IEventConstructors;
}

export interface EventStoreBrokerFeature extends BaseBrokerFeatureOption {
  type: EventStoreBrokerTypes.EventStore;
  subscriptions: EventStoreSubscription[];
}

export interface StanBrokerFeature extends BaseBrokerFeatureOption{
  type: EventStoreBrokerTypes.STAN;
  subscriptions: StanSubscription[];
}

export type EventStoreFeatureOptions =| EventStoreBrokerFeature | StanBrokerFeature;

export interface EventStoreFeatureOptionsFactory {
  createFeatureOptions(
    connectionName?: string
  ): Promise<EventStoreFeatureOptions> | EventStoreFeatureOptions;
}

export interface EventStoreFeatureAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  type: EventStoreBrokerTypes
  useExisting?: Type<EventStoreFeatureOptionsFactory>;
  useClass?: Type<EventStoreFeatureOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<EventStoreFeatureOptions> | EventStoreFeatureOptions;
  inject?: any[];
}
