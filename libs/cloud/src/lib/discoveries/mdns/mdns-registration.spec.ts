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
 * File name:         mdns-registration.spec.ts
 * Last modified:     11/02/2021, 00:22
 ******************************************************************************/

import { MdnsRegistration } from './mdns-registration';
import { MdnsDiscoveryOptions } from './interfaces';
import { Service } from '../../interfaces';

const newService: Service = {
  address: '127.0.0.1',
  id: 'consul-service',
  port: 9000,
  name: 'service',
};
const consulDiscoveryOptions: MdnsDiscoveryOptions = {
  scheme: 'http',
  failFast: false,
  healthCheckCriticalTimeout: '1000',
  healthCheckUrl: '/',
};

describe('MdnsRegistration', () => {
  it('can get registration host', async () => {
    let result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getHost()).toEqual(newService.address);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new MdnsRegistration({ address: null }, consulDiscoveryOptions);
    expect(result.getHost()).toEqual('');
  });

  it('can get registration port', async () => {
    let result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getPort()).toEqual(newService.port);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new MdnsRegistration({ port: null }, consulDiscoveryOptions);
    expect(result.getPort()).toEqual(0);
  });

  it('can get registration scheme', async () => {
    let result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getScheme()).toEqual(consulDiscoveryOptions.scheme);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new MdnsRegistration(newService, { scheme: null });
    expect(result.getScheme()).toEqual('http');
  });

  it('can check registration secure', async () => {
    const result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.isSecure()).toEqual(false);
  });

  it('can get registration uri', async () => {
    const result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getUri()).toEqual(
      `${consulDiscoveryOptions.scheme}://${newService.address}:${newService.port}`
    );
  });

  it('can get registration service', async () => {
    const result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getService()).toEqual(newService);
  });

  it('can get registration instance id', async () => {
    let result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getInstanceId()).toEqual(newService.id);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new MdnsRegistration({ id: null }, consulDiscoveryOptions);
    expect(result.getInstanceId()).toEqual('');
  });

  it('can get registration service id', async () => {
    const result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getServiceId()).toEqual(newService.name);
  });

  it('can get registration metadata', async () => {
    const result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getMetadata()).toEqual(null);
  });
});
