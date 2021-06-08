import { ConsulRegistration } from './consul-registration';
import { Service } from '../consul.interface';
import { ConsulDiscoveryOptions } from './consul-discovery.options';

const newService: Service = {
  address: '127.0.0.1',
  id: 'consul-service',
  port: 9000,
  check: undefined,
  name: 'service',
  tags: ['svc=cluster'],
  meta: {
    svc: 'cluster',
  },
};

const consulDiscoveryOptions: ConsulDiscoveryOptions = {
  type: 'http',
  scheme: 'http',
  failFast: false,
  timeout: 1000,
  http: '/',
};

describe('ConsulRegistration', () => {
  it('can get registration host', async () => {
    let result = new ConsulRegistration(newService, consulDiscoveryOptions);
    expect(result.getHost()).toEqual(newService.address);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new ConsulRegistration({ address: null }, consulDiscoveryOptions);
    expect(result.getHost()).toEqual('');
  });

  it('can get registration port', async () => {
    let result = new ConsulRegistration(newService, consulDiscoveryOptions);
    expect(result.getPort()).toEqual(newService.port);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new ConsulRegistration({ port: null }, consulDiscoveryOptions);
    expect(result.getPort()).toEqual(0);
  });

  it('can get registration scheme', async () => {
    let result = new ConsulRegistration(newService, consulDiscoveryOptions);
    expect(result.getScheme()).toEqual(consulDiscoveryOptions.scheme);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new ConsulRegistration(newService, { scheme: null });
    expect(result.getScheme()).toEqual('http');
  });

  it('can check registration secure', async () => {
    const result = new ConsulRegistration(newService, consulDiscoveryOptions);
    expect(result.isSecure()).toEqual(false);
  });

  it('can get registration uri', async () => {
    const result = new ConsulRegistration(newService, consulDiscoveryOptions);
    expect(result.getUri()).toEqual(
      `${consulDiscoveryOptions.scheme}://${newService.address}:${newService.port}`
    );
  });

  it('can get registration service', async () => {
    const result = new ConsulRegistration(newService, consulDiscoveryOptions);
    expect(result.getService()).toEqual(newService);
  });

  it('can get registration instance id', async () => {
    let result = new ConsulRegistration(newService, consulDiscoveryOptions);
    expect(result.getInstanceId()).toEqual(newService.id);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new ConsulRegistration({ id: null }, consulDiscoveryOptions);
    expect(result.getInstanceId()).toEqual('');
  });

  it('can get registration service id', async () => {
    const result = new ConsulRegistration(newService, consulDiscoveryOptions);
    expect(result.getServiceId()).toEqual(newService.name);
  });

  it('can get registration metadata and tags', async () => {
    let result = new ConsulRegistration(newService, consulDiscoveryOptions);
    const m = { svc: 'cluster' };
    expect(result.getMetadata()).toEqual(m);
    expect(result.getTags()).toEqual(['svc=cluster']);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new ConsulRegistration(
      { tags: null, meta: null },
      consulDiscoveryOptions
    );
    expect(result.getMetadata()).toEqual({});
    expect(result.getTags()).toEqual([]);
  });
});
