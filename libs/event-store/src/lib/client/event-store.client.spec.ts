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
 * File name:         stan.client.spec.ts
 * Last modified:     14/02/2021, 23:51
 ******************************************************************************/
import { Test } from '@nestjs/testing';
import { EventStoreClient } from './event-store.client';
import { ProvidersConstants } from '../event-store.constant';
import { EventStoreBrokerTypes, EventStoreModuleOptions } from '../interface';


describe('EventStoreClient', () => {
  let service: EventStoreClient;

  beforeEach(async () => {

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ProvidersConstants.EVENT_STORE_CONFIG,
          useValue: {
            debug: true,
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
        EventStoreClient,
      ],
    }).compile();

    service = module.get(EventStoreClient);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('connected should be false', () => {
    expect(service.connected).toBeFalsy();
  });

  it('client should not throw', () => {
    expect(() => service.connect()).not.toThrow();
    expect(service.connected).toBeTruthy();
    expect(service.client()).toBeDefined();
  });
});
