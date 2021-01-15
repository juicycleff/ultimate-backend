import { initConsulProviders } from './consul-provider-utils';

describe('Consul Utils', () => {
  it('consul provider initializes', async () => {
    const result = initConsulProviders({
      client: {
        aclToken: 'foobar',
        host: 'localhost',
        passing: true,
        port: 9000,
        secure: true,
      },
      discoverer: 'consul',
      discovery: {
        healthCheckUrl: '/',
        healthCheckCriticalTimeout: '5000',
        failFast: true,
        scheme: 'scheme',
      },
      heartbeat: undefined,
      service: null,
    });
    expect(result).toBeDefined();
  });
});
