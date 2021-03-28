import { validateOptions } from './validate-options';
import { ConsulRegistryProviderOptions } from '../';
import { DiscoveryOptions, HeartbeatOptions, Service } from '@ultimate-backend/common';

const service: Service = {
  address: '127.0.0.1',
  id: 'consul-service',
  port: 9000,
  name: 'service',
};

const discovery: DiscoveryOptions = {
  timeout: 1000,
  http: '/',
  type: 'http',
};

const heartbeat: HeartbeatOptions = {
  ttlInSeconds: 9000,
  enabled: true,
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
      heartbeat: null,
    }) as ConsulRegistryProviderOptions;

    expect(result.heartbeat).toEqual({
      ttlInSeconds: 30,
      enabled: true,
    });

    result = validateOptions({
      ...result,
      discoverer: null,
    }) as ConsulRegistryProviderOptions;

    expect(result).toBeDefined();
  });
});
