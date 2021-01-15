import { validateOptions } from './iplist';
import * as NewService from '../discoveries/consul/consul-interfaces';
import { ConsulRegistryProviderOptions, HeartbeatOptions } from '../';
import { ConsulDiscoveryOptions } from '../discoveries/consul/interfaces';

const service: NewService.Service = {
  address: '127.0.0.1',
  id: 'consul-service',
  port: 9000,
  check: undefined,
  name: "service",
  tags: ['svc=cluster'],
};

const discovery: ConsulDiscoveryOptions = {
  scheme: 'http',
  failFast: false,
  healthCheckCriticalTimeout: '1000',
  healthCheckUrl: '/',
};

const heartbeat: HeartbeatOptions = {
  ttlInSeconds: 9000,
  enabled: true
};

describe('Cloud Utils', () => {
  it('can validate consul cloud options', async () => {
    let result = validateOptions({
      service,
      discovery,
      discoverer: 'consul',
      heartbeat,
    }) as ConsulRegistryProviderOptions;
    expect(result.discoverer).toEqual('consul');
    expect(result.heartbeat).toEqual(heartbeat);
    expect(result.discovery).toEqual(discovery);

    result = validateOptions({
      ...result,
      discovery: null,
      heartbeat: null
    }) as ConsulRegistryProviderOptions;

    expect(result.heartbeat).toEqual({
      ttlInSeconds: 30,
      enabled: true,
    });
    expect(result.discovery).toEqual({
      scheme: 'http',
      failFast: true,
    });

    result = validateOptions({
      ...result,
      discoverer: null,
    }) as ConsulRegistryProviderOptions;

    expect(result).toBeDefined();
  });
});
