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
 * File name:         consul-registration.builder.ts
 * Last modified:     11/02/2021, 02:58
 ******************************************************************************/

import { IpUtils, RegistrationBuilder } from '@ultimate-backend/common';
import * as uuid from 'uuid';
import { Check, Service } from '../consul.interface';
import { HeartbeatOptions } from '../discovery/heartbeat.interface';
import { ConsulDiscoveryOptions } from './consul-discovery.options';
import { ConsulRegistration } from './consul-registration';

export class ConsulRegistrationBuilder implements RegistrationBuilder {
  private _serviceName: string | undefined;
  private _port: number | undefined;
  private _host: string | undefined;
  private _domain: string | undefined;
  private _instanceId: string | undefined;
  private _heartbeatOptions: HeartbeatOptions | undefined;
  private _discoveryOptions: ConsulDiscoveryOptions | undefined;

  constructor(host?: string, port?: number) {
    this._host = host;
    this._port = port;
  }

  domain(domain: string): RegistrationBuilder {
    this._domain = domain || 'ultimate-backend';
    return this;
  }

  discoveryOptions(properties: ConsulDiscoveryOptions): RegistrationBuilder {
    this._discoveryOptions = properties;
    return this;
  }

  heartbeatOptions(properties: HeartbeatOptions): RegistrationBuilder {
    this._heartbeatOptions = properties;
    return this;
  }

  host(host: string): RegistrationBuilder {
    this._host = host;
    return this;
  }

  instanceId(id: string): RegistrationBuilder {
    this._instanceId = id;
    return this;
  }

  port(port: number): RegistrationBuilder {
    this._port = port;
    return this;
  }

  serviceName(name: string): RegistrationBuilder {
    this._serviceName = name;
    return this;
  }

  build(): ConsulRegistration {
    if (this._serviceName == null) throw Error('serviceName is required');

    if (this._host == null) {
      // get ip address
      this._host = IpUtils.getIpAddress();
    }

    if (this._port == null) throw Error('port is required');

    if (this._discoveryOptions == null)
      throw Error('discoveryOptions is required.');

    const scheme = this._discoveryOptions?.scheme;
    const isSecure = scheme == 'https';

    const tags = [`secure=${isSecure}`];

    if (this._instanceId == null) {
      this._instanceId = this._serviceName + '-' + uuid.v4();
    }

    const check: Check = this.createCheck();

    const newService: Service = {
      name: this._serviceName,
      port: this._port,
      address: this._host,
      id: this._instanceId,
      tags,
      check,
    };

    return new ConsulRegistration(newService, this._discoveryOptions);
  }

  private createCheck(): Check {
    let check: Check = {};

    if (this._discoveryOptions?.healthCheckCriticalTimeout !== null) {
      check = {
        ...check,
        deregistercriticalserviceafter: this._discoveryOptions
          .healthCheckCriticalTimeout,
      };
    }

    if (this._discoveryOptions?.healthCheckUrl !== null) {
      check = {
        ...check,
        http: this._discoveryOptions.healthCheckUrl,
      };
    }

    if (this._heartbeatOptions?.enabled) {
      const ttl = this._heartbeatOptions.ttlInSeconds + 's';
      return {
        ...check,
        ttl,
      };
    }

    return check;
  }
}
