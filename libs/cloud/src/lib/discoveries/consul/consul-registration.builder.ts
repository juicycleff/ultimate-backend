import * as uuid from 'uuid';
import { HeartbeatOptions, Registration, RegistrationBuilder } from '../../interfaces';
import { IpUtils } from '../../utils';
import * as NewService from './consul-interfaces';
import { ConsulDiscoveryOptions } from './interfaces';
import { ConsulRegistration } from './consul-registration';

export class ConsulRegistrationBuilder implements RegistrationBuilder {
  private _serviceName: string | undefined;
  private _port: number | undefined;
  private _host: string | undefined;
  private _instanceId: string | undefined;
  private _heartbeatOptions: HeartbeatOptions | undefined;
  private _discoveryOptions: ConsulDiscoveryOptions | undefined;

  constructor(host?: string, port?: number) {
    this._host = host;
    this._port = port;
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

    if (this._discoveryOptions == null) throw Error('ConsulDiscoveryOptions is required.');

    const scheme = this._discoveryOptions?.scheme;
    const isSecure = scheme == 'https';

    const tags = [`secure=${isSecure}`];

    if (this._instanceId == null) {
      this._instanceId = this._serviceName + '-' + uuid.v4();
    }

    const check: NewService.Check = this.createCheck();

    const newService: NewService.Service = {
      name: this._serviceName,
      port: this._port,
      address: this._host,
      id: this._instanceId,
      tags,
      check,
    };

    return new ConsulRegistration(newService, this._discoveryOptions);
  }

  private createCheck(): NewService.Check {
    let check: NewService.Check = {};

    if (this._discoveryOptions?.healthCheckCriticalTimeout != null) {
      check = {
        ...check,
        deregistercriticalserviceafter: this._discoveryOptions.healthCheckCriticalTimeout,
      };
    }

    if (this._discoveryOptions?.healthCheckUrl != null) {
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
