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
 * File name:         mdns-registration.ts
 * Last modified:     11/02/2021, 00:22
 ******************************************************************************/

import { PlainObject, Registration } from '@ultimate-backend/common';
import { MdnsDiscoveryOptions } from './interfaces';
import { Service } from 'bonjour';

export class MdnsRegistration implements Registration<Service> {
  constructor(
    private service: Partial<Service>,
    private discoveryOptions: MdnsDiscoveryOptions
  ) {}

  getService(): Service {
    return <Service>this.service;
  }

  getInstanceId(): string {
    return this.service.txt?.serviceId || '';
  }

  getServiceId(): string {
    return this.service.name;
  }

  getHost(): string {
    return this.service.host || '';
  }

  getDomain(): string {
    return this.service.txt?.domain || 'ultimate-backend';
  }

  getPort(): number {
    return this.service.port || 0;
  }

  isSecure(): boolean {
    return this.discoveryOptions?.scheme === 'https' || false;
  }

  getUri(): string {
    const scheme = this.getScheme();
    return `${scheme}://${this.getHost()}:${this.getPort()}`;
  }

  getScheme(): string {
    return this.discoveryOptions?.scheme || 'http';
  }

  getMetadata(): PlainObject {
    return this.service.txt;
  }

  getNodeID(): string {
    return '';
  }

  getStatus(): string {
    return this.service?.txt['status'] || '';
  }

  getTags(): string[] {
    return [];
  }
}
