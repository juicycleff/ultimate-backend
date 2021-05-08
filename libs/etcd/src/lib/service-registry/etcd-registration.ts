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
 * File name:         etcd-registration.ts
 * Last modified:     15/03/2021, 15:35
 ******************************************************************************/
import { PlainObject, Registration, Service } from '@ultimate-backend/common';
import { EtcdDiscoveryOptions } from './etcd-discovery.options';

export class EtcdRegistration implements Registration<Service> {
  private newService: Service;
  private discoveryOptions: EtcdDiscoveryOptions;

  constructor(newService: Service, discoveryOptions: EtcdDiscoveryOptions) {
    this.newService = newService;
    this.discoveryOptions = discoveryOptions;
  }

  getService(): Service {
    return this.newService;
  }

  getInstanceId(): string {
    return this.newService.id || '';
  }

  getServiceId(): string {
    return this.newService.name;
  }

  getHost(): string {
    return this.newService.address || '';
  }

  getPort(): number {
    return this.newService.port || 0;
  }

  isSecure(): boolean {
    return this.discoveryOptions.scheme === 'https';
  }

  getUri(): string {
    const scheme = this.getScheme();
    return `${scheme}://${this.getHost()}:${this.getPort()}`;
  }

  getScheme(): string {
    return this.discoveryOptions.scheme || 'http';
  }

  getMetadata(): PlainObject {
    return this.newService.metadata || {};
  }

  getNodeID(): string {
    return '';
  }

  getStatus(): string {
    return this.newService.status || '';
  }

  getTags(): string[] {
    return this.newService.tags || [];
  }
}
