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
 * File name:         event-store.broker.spec.ts
 * Last modified:     14/02/2021, 23:49
 ******************************************************************************/

import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreBroker } from './event-store.broker';
import { ProvidersConstants } from '../event-store.constant';
import { EventStoreBrokerTypes, EventStoreFeatureOptions, EventStoreModuleOptions } from '../interface';
import { EventStoreClient } from '../client';

describe('EventStoreBroker', () => {
  let service: EventStoreBroker;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        {
          provide: ProvidersConstants.EVENT_STORE_CONFIG,
          useValue: {
            broker: {
              type: EventStoreBrokerTypes.EventStore,
              channelCredentials: {
                insecure: true
              },
              connectionSettings: {
                endpoint: {
                  address: 'localhost',
                  port: 2113,
                }
              }
            }
          } as EventStoreModuleOptions,
        },
        {
          provide: ProvidersConstants.EVENT_STORE_FEATURE_CONFIG,
          useValue: {
            type: EventStoreBrokerTypes.EventStore,
            streamName: 'event-store',
          } as EventStoreFeatureOptions,
        },
        EventStoreClient,
        EventStoreBroker,
      ],
    }).compile();

    service = module.get(EventStoreBroker);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
