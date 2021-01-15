import { ConsulDiscoveryClient } from './consul-discovery-client';
import { ServiceInstance } from '@ultimate-backend/cloud';

jest.mock('./consul-discovery-client');

describe('ConsulDiscoveryClient', () => {
  let client = new ConsulDiscoveryClient({
    host: 'test-host',
    port: 8350,
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ConsulDiscoveryClient.mockClear();
  });

  it('client description', async () => {
    const result = 'Consul Discovery Client';
    jest.spyOn(client, 'description').mockImplementation(() => result);
    expect(client.description()).toEqual(result);
  });

  it('get services succeeds', async () => {
    const result = ['service-test'];
    jest.spyOn(client, 'getServices').mockImplementation(async () => result);
    expect(await client.getServices()).toEqual(result);
  });

  it('get services succeeds with token', async () => {
    client = new ConsulDiscoveryClient({
      host: 'test-host',
      port: 8350,
      aclToken: 'test-token',
    });

    const result = ['service-test'];
    jest.spyOn(client, 'getServices').mockImplementation(async () => result);
    expect(await client.getServices()).toEqual(result);
  });

  it('get instance succeeds with token', async () => {
    client = new ConsulDiscoveryClient({
      host: 'test-host',
      port: 8350,
    });

    const result: ServiceInstance[] = [];
    jest.spyOn(client, 'getInstances').mockImplementation(async () => result);
    expect(await client.getInstances('test-token')).toHaveLength(0);
  });

  it('get instance succeeds with token', async () => {
    client = new ConsulDiscoveryClient({
      host: 'test-host',
      port: 8350,
      aclToken: 'access-token',
    });

    const result: ServiceInstance[] = [];
    jest.spyOn(client, 'getInstances').mockImplementation(async () => result);
    expect(await client.getInstances('test-token')).toHaveLength(0);
  });
});
