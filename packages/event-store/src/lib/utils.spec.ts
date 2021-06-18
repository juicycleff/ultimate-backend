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
import { EventStoreBrokerTypes } from './interface/broker.enums';
import { EventStoreModuleOptions } from './interface/event-store-module.options';
import { getClientProvider, getClientProviderAsync } from './utils';

describe('Utils', () => {
  const stanOpts: EventStoreModuleOptions = {
    broker: {
      type: EventStoreBrokerTypes.Stan,
      clientId: 'test-client-id',
      clusterId: 'my-cluster',
      options: null,
    },
  };

  const esOpts: EventStoreModuleOptions = {
    broker: {
      type: EventStoreBrokerTypes.Stan,
      clientId: 'test-client-id',
      clusterId: 'my-cluster',
      options: null,
    },
  };

  it('successfully returns stan client', () => {
    expect(() => getClientProvider(stanOpts)).not.toThrow();
    const provider = getClientProvider(stanOpts);
    expect(provider).toBeDefined();
  });

  it('successfully returns a provider with a stan client', () => {
    expect(() => getClientProviderAsync()).not.toThrow();
  });

  it('successfully returns event-store client', () => {
    expect(() => getClientProvider(esOpts)).not.toThrow();
    const provider = getClientProvider(esOpts);
    expect(provider).toBeDefined();
  });

  it('throws error for unsupported client', () => {
    expect(() =>
      getClientProvider({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        broker: {
          type: undefined,
        },
      })
    ).toThrowError('event store broker type not supported');
  });
});
