import { MdnsRegistration } from './mdns-registration';
import { MdnsDiscoveryOptions } from './interfaces';
import { Service } from '../../interfaces';

const newService: Service = {
  address: '127.0.0.1',
  id: 'consul-service',
  port: 9000,
  check: undefined,
  name: 'service',
  tags: ['svc=cluster'],
};
const consulDiscoveryOptions: MdnsDiscoveryOptions = {
  scheme: 'http',
  failFast: false,
  healthCheckCriticalTimeout: '1000',
  healthCheckUrl: '/',
};

describe('MdnsRegistration', () => {
  it('can get registration host', async () => {
    let result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getHost()).toEqual(newService.address);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new MdnsRegistration({ address: null }, consulDiscoveryOptions);
    expect(result.getHost()).toEqual('');
  });

  it('can get registration port', async () => {
    let result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getPort()).toEqual(newService.port);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new MdnsRegistration({ port: null }, consulDiscoveryOptions);
    expect(result.getPort()).toEqual(0);
  });

  it('can get registration scheme', async () => {
    let result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getScheme()).toEqual(consulDiscoveryOptions.scheme);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new MdnsRegistration(newService, { scheme: null });
    expect(result.getScheme()).toEqual('http');
  });

  it('can check registration secure', async () => {
    const result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.isSecure()).toEqual(false);
  });

  it('can get registration uri', async () => {
    const result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getUri()).toEqual(
      `${consulDiscoveryOptions.scheme}://${newService.address}:${newService.port}`
    );
  });

  it('can get registration service', async () => {
    const result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getService()).toEqual(newService);
  });

  it('can get registration instance id', async () => {
    let result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getInstanceId()).toEqual(newService.id);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result = new MdnsRegistration({ id: null }, consulDiscoveryOptions);
    expect(result.getInstanceId()).toEqual('');
  });

  it('can get registration service id', async () => {
    const result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getServiceId()).toEqual(newService.name);
  });

  it('can get registration metadata', async () => {
    const result = new MdnsRegistration(newService, consulDiscoveryOptions);
    expect(result.getMetadata()).toEqual(null);
  });
});
