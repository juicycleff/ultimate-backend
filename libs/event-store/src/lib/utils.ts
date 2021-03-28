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
 * File name:         find-type.utils.ts
 * Last modified:     14/02/2021, 18:14
 ******************************************************************************/

import {
  EVENT_STORE_MODULE_OPTION,
  ProvidersConstants,
} from './event-store.constant';
import { EventStoreBrokerTypes, EventStoreModuleOptions } from './interface';
import { EventStoreClient, StanClient } from './client';
import { Provider } from '@nestjs/common';
import { EventStoreConfig } from './event-store.config';

export function getClientProvider(option: EventStoreModuleOptions) {
  const providers = [];
  switch (option.broker.type) {
    case EventStoreBrokerTypes.EventStore:
      providers.push(EventStoreClient);
      break;
    case EventStoreBrokerTypes.STAN:
      providers.push(StanClient);
      break;
    default:
      throw new Error('event store broker type not supported');
  }
  return providers;
}

export function getClientProviderAsync(): Provider {
  return {
    provide: ProvidersConstants.EVENT_STORE_CLIENT,
    useFactory: (esOptions: EventStoreModuleOptions): any => {
      switch (esOptions.broker.type) {
        case EventStoreBrokerTypes.EventStore:
          return EventStoreClient;
        case EventStoreBrokerTypes.STAN:
          return StanClient;
        default:
          throw new Error('event store broker type not supported');
      }
    },
    inject: [EVENT_STORE_MODULE_OPTION],
  };
}

export function getClientProviderAsyncBoot(): Provider {
  return {
    provide: ProvidersConstants.EVENT_STORE_CLIENT,
    useFactory: (option: EventStoreConfig): any => {
      console.log('event store***********************', option);
      switch (option.config.broker.type) {
        case EventStoreBrokerTypes.EventStore:
          return EventStoreClient;
        case EventStoreBrokerTypes.STAN:
          return StanClient;
        default:
          throw new Error('event store broker type not supported');
      }
    },
    inject: [ProvidersConstants.EVENT_STORE_CONFIG],
  };
}
