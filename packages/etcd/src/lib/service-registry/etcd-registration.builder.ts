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
 * File name:         etcd-registration.builder.ts
 * Last modified:     15/03/2021, 15:36
 ******************************************************************************/
import {
  HeartbeatOptions,
  IpUtils,
  PlainObject,
  RegistrationBuilder,
  Service,
} from '@ultimate-backend/common';
import * as uuid from 'uuid';
import { EtcdDiscoveryOptions } from './etcd-discovery.options';
import { EtcdRegistration } from './etcd-registration';

export class EtcdRegistrationBuilder implements RegistrationBuilder {
  private _serviceName: string | undefined;
  private _port: number | undefined;
  private _host: string | undefined;
  private _status: string;
  private _version: string;
  private _tags: string[] | undefined;
  private _domain: string | undefined;
  private _meta: PlainObject | undefined;
  private _instanceId: string | undefined;
  private _heartbeatOptions: HeartbeatOptions | undefined;
  private _discoveryOptions: EtcdDiscoveryOptions | undefined;

  constructor(host?: string, port?: number) {
    this._host = host;
    this._port = port;
  }

  domain(domain: string): RegistrationBuilder {
    this._domain = domain || 'ultimate-backend';
    return this;
  }

  tags(tags: string[]): RegistrationBuilder {
    this._tags = tags;
    return this;
  }

  metadata(metadata: PlainObject): RegistrationBuilder {
    this._meta = metadata;
    return this;
  }

  discoveryOptions(properties: EtcdDiscoveryOptions): RegistrationBuilder {
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

  build(): EtcdRegistration {
    if (!this._serviceName) {
      throw Error('serviceName is required');
    }

    if (!this._host) {
      this._host = IpUtils.getIpAddress();
    }

    if (!this._port) {
      throw Error('port is required');
    }

    if (!this._discoveryOptions) {
      throw Error('discoveryOptions is required.');
    }

    const scheme = this._discoveryOptions?.scheme;
    const isSecure = scheme == 'https';
    const domain = this._domain || 'ultimate-backend';

    const tags = ['service', this._version].concat(...(this._tags || []));
    const metadata = Object.assign(
      {},
      {
        domain: domain,
        secure: `${isSecure}`,
        version: this._version,
      },
      this._meta
    );

    if (!this._instanceId) {
      this._instanceId = `service__${this._serviceName}__${
        this._version
      }-${uuid.v4()}`;
    } else {
      this._instanceId = `service__${this._serviceName}__${this._instanceId}-${this._version}`;
    }

    if (
      this._heartbeatOptions.enabled &&
      !this._heartbeatOptions.ttlInSeconds
    ) {
      this._heartbeatOptions.ttlInSeconds = 30;
    }

    let checks;
    if (Array.isArray(this._discoveryOptions)) {
      checks = this._discoveryOptions;
    } else {
      checks = this._discoveryOptions;
    }

    const newService: Service = {
      name: this._serviceName,
      port: this._port,
      address: this._host,
      id: this._instanceId,
      tags,
      checks,
      metadata,
    };

    return new EtcdRegistration(newService, this._discoveryOptions);
  }

  version(version: string): RegistrationBuilder {
    this._version = version || 'latest';
    return this;
  }

  status(status: string): RegistrationBuilder {
    this._status = status;
    return this;
  }
}
