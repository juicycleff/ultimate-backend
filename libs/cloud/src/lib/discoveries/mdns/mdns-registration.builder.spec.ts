import { MdnsRegistrationBuilder } from './mdns-registration.builder';

describe('MdnsRegistrationBuilder', () => {
  let client = new MdnsRegistrationBuilder('http://localhost', 9000);

  it('throw error if serviceName is missing', async () => {
    const t = () => client.build();
    expect(t).toThrow('serviceName is required');
  });

  it('throw error if discoveryOptions is missing', async () => {
    const t = () => {
      client.serviceName('service-name').build();
    };
    expect(t).toThrow('discoveryOptions is required.');
  });

  it('successfully build', async () => {
    const t = client
      .serviceName('service-name')
      .discoveryOptions({
        healthCheckCriticalTimeout: '3000',
        healthCheckUrl: '/',
      })
      .build();
    expect(t).toBeDefined();
  });

  it('can pass heartbeatOptions successfully', async () => {
    const t = client.heartbeatOptions({
      enabled: true,
      ttlInSeconds: 6000,
    });
    expect(t).toBeDefined();
  });

  it('can pass heartbeatOptions successfully when disabled', async () => {
    const t = client
      .host(null)
      .instanceId('2')
      .serviceName('service-name')
      .discoveryOptions({
        healthCheckCriticalTimeout: '3000',
        healthCheckUrl: '/',
      })
      .heartbeatOptions({
        enabled: true,
        ttlInSeconds: 6000,
      })
      .build();
    expect(t).toBeDefined();
  });

  it('can pass heartbeatOptions successfully', async () => {
    const t = client.host('http://localhost').instanceId('2').port(9000);
    expect(t).toBeDefined();
  });

  it('generates host dynamically', async () => {
    client = new MdnsRegistrationBuilder('http://localhost', 9000);
    const t = client
      .host(null)
      .instanceId('2')
      .serviceName('service-name')
      .discoveryOptions({
        healthCheckCriticalTimeout: '3000',
        healthCheckUrl: '/',
      })
      .build();
    expect(t).toBeDefined();
  });

  it('throw error if port is missing', async () => {
    client = new MdnsRegistrationBuilder('http://localhost', null);
    const t = () => {
      client
        .serviceName('service-name')
        .discoveryOptions({
          healthCheckCriticalTimeout: '3000',
          healthCheckUrl: '/',
        })
        .build();
    };
    expect(t).toThrow('port is required');
  });
});
