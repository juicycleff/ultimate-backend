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
 * File name:         stan.broker.spec.ts
 * Last modified:     14/02/2021, 23:51
 ******************************************************************************/

import { Test } from '@nestjs/testing';
import { StanBroker } from './stan.broker';
import { ProvidersConstants } from '../event-store.constant';
import { EventStoreModuleOptions } from '../interface';
import { StanClient } from '../client';

describe('StanBroker', () => {
  let service: StanBroker;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ProvidersConstants.EVENT_STORE_CONFIG,
          useValue: {
            debug: true,
            broker: {
              clientId: 'test-client-id'
            }
          } as EventStoreModuleOptions,
        },
        StanClient,
        StanBroker,
      ],
    }).compile();

    service = module.get(StanBroker);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
