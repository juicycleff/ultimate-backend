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
import { Service } from 'bonjour';

const newService: Service & any = {
  host: '127.0.0.1',
  txt: {
    serviceId: 'consul-service',
  },
  port: 9000,
  name: 'service',
};
const mdnsDiscoveryOptions: MdnsDiscoveryOptions = {
  scheme: 'http',
  failFast: false,
  timeout: 1000,
  type: 'http',
  http: '/',
};

describe('MdnsRegistration', () => {
  it('can get registration host', async () => {
    let result = new MdnsRegistration(newService, mdnsDiscoveryOptions);
    expect(result.getHost()).toEqual(newService.host);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new MdnsRegistration({ address: null }, mdnsDiscoveryOptions);
    expect(result.getHost()).toEqual('');
  });

  it('can get registration port', async () => {
    let result = new MdnsRegistration(newService, mdnsDiscoveryOptions);
    expect(result.getPort()).toEqual(newService.port);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new MdnsRegistration({ port: null }, mdnsDiscoveryOptions);
    expect(result.getPort()).toEqual(0);
  });

  it('can get registration scheme', async () => {
    let result = new MdnsRegistration(newService, mdnsDiscoveryOptions);
    expect(result.getScheme()).toEqual(mdnsDiscoveryOptions.scheme);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new MdnsRegistration(newService, { scheme: null });
    expect(result.getScheme()).toEqual('http');
  });

  it('can check registration secure', async () => {
    const result = new MdnsRegistration(newService, mdnsDiscoveryOptions);
    expect(result.isSecure()).toEqual(false);
  });

  it('can get registration uri', async () => {
    const result = new MdnsRegistration(newService, mdnsDiscoveryOptions);
    expect(result.getUri()).toEqual(
      `${mdnsDiscoveryOptions.scheme}://${newService.host}:${newService.port}`
    );
  });

  it('can get registration service', async () => {
    const result = new MdnsRegistration(newService, mdnsDiscoveryOptions);
    expect(result.getService()).toEqual(newService);
  });

  it('can get registration instance id', async () => {
    let result = new MdnsRegistration(newService, mdnsDiscoveryOptions);
    expect(result.getInstanceId()).toEqual("consul-service");
    result = new MdnsRegistration(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      { id: 'my-instance', txt: { serviceId: 'my-instance' } },
      mdnsDiscoveryOptions
    );
    expect(result.getInstanceId()).toEqual('my-instance');
  });

  it('can get registration service id', async () => {
    const result = new MdnsRegistration(newService, mdnsDiscoveryOptions);
    expect(result.getServiceId()).toEqual(newService.name);
  });

  it('can get registration metadata', async () => {
    const result = new MdnsRegistration(newService, mdnsDiscoveryOptions);
    expect(result.getMetadata()).toEqual({ serviceId: "consul-service"});
  });
});
