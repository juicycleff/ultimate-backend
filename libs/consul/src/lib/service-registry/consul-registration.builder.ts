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

import {
  IpUtils,
  PlainObject,
  RegistrationBuilder,
} from '@ultimate-backend/common';
import * as uuid from 'uuid';
import { Check, Service } from '../consul.interface';
import { HeartbeatOptions } from '../discovery/heartbeat.interface';
import { ConsulDiscoveryOptions } from './consul-discovery.options';
import { ConsulRegistration } from './consul-registration';

export class ConsulRegistrationBuilder implements RegistrationBuilder {
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
  private _discoveryOptions: ConsulDiscoveryOptions | undefined;

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

  state(metadata: PlainObject): RegistrationBuilder {
    this._meta = metadata;
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
    const meta = Object.assign(
      {},
      {
        domain: domain,
        secure: `${isSecure}`,
        version: this._version,
      },
      this._meta
    );

    if (!this._instanceId) {
      this._instanceId = this._serviceName + '-' + uuid.v4();
    } else {
      this._instanceId = `${this._instanceId}-${this._version}`;
    }

    if (
      this._heartbeatOptions.enabled &&
      !this._heartbeatOptions.ttlInSeconds
    ) {
      this._heartbeatOptions.ttlInSeconds = 30;
    }

    const check: Check = this.createCheck(this._discoveryOptions);

    const newService: Service = {
      name: this._serviceName,
      port: this._port,
      address: this._host,
      id: this._instanceId,
      tags,
      check,
      meta,
    };

    return new ConsulRegistration(newService, this._discoveryOptions);
  }

  private createCheck(opts: ConsulDiscoveryOptions): Check {
    const check: Partial<Check> = {
      service_id: opts.serviceId || this._instanceId,
      name: opts.serviceName || this._serviceName + ' Status',
      interval: (opts.interval || 10) + 's',
    };

    if (opts?.notes) {
      check.notes = opts?.notes;
    }

    if (opts?.deregisterCriticalServiceAfter) {
      check.deregister_critical_service_after =
        opts?.deregisterCriticalServiceAfter;
    }

    switch (opts.type) {
      case 'alias':
        check.alias_service = opts?.aliasService;
        check.alias_node = opts?.aliasNode;
        break;
      case 'grpc':
        check.grpc = opts?.grpc;
        check.grpc_use_tls = opts?.useTLS;
        break;
      case 'ttl':
        check.ttl = (opts?.ttl || 30) + 's';
        if (!this._heartbeatOptions) {
          this._heartbeatOptions.enabled = true;
          this._heartbeatOptions.ttlInSeconds = 30;
        }
        break;
      case 'docker':
        check.docker_container_id = opts?.dockerContainerId;
        check.timeout = (opts?.timeout || 10) + 's';
        check.shell = opts?.shell;
        check.args = opts?.args;
        break;
      case 'tcp':
        check.tcp = opts?.tcp;
        if (!this._heartbeatOptions) {
          this._heartbeatOptions.enabled = true;
          this._heartbeatOptions.ttlInSeconds = 30;
        }
        break;
      case 'http':
        check.http = opts?.http;
        check.timeout = (opts?.timeout || 10) + 's';
        check.body = opts?.body;
        check.header = opts?.header;
        check.method = opts?.method;
        check.tls_skip_verify = opts?.skipVerifyTLS || true;
        break;
      case 'script':
        check.args = opts?.args;
        check.script = opts?.script;
        check.timeout = (opts?.timeout || 10) + 's';
        break;
      default:
        check.ttl = '30s';
        break;
    }

    return check as Check;
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
