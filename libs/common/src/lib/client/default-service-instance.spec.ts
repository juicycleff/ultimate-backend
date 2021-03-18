import { DefaultServiceInstance } from './default-service-instance';

const instanceId = 'string';
const serviceId = 'string';
const host = 'string';
const port = 2133;
const secure = true;
const metadata = {};

describe('DefaultServiceInstance', () => {
  let service: DefaultServiceInstance;

  beforeEach(() => {
    service = new DefaultServiceInstance({
      instanceId,
      serviceId,
      host,
      port,
      secure,
      metadata,
    });
  });

  it('can get registration host', async () => {
    expect(service.getHost()).toEqual(host);
  });

  it('can get registration port', async () => {
    expect(service.getPort()).toEqual(port);
  });

  it('can check registration secure', async () => {
    expect(service.isSecure()).toEqual(secure);
  });

  it('can get registration uri', async () => {
    expect(service.getUri()).toEqual(`https://${host}:${port}`);
  });
  it('can get registration instance id', async () => {
    expect(service.getInstanceId()).toEqual(instanceId);
  });

  it('can get registration service id', async () => {
    expect(service.getServiceId()).toEqual(serviceId);
  });

  it('can get registration scheme', async () => {
    expect(service.getScheme()).toEqual('https');
    service = new DefaultServiceInstance({
      instanceId,
      serviceId,
      host,
      port,
      secure: false,
      metadata,
    });
    expect(service.getScheme()).toEqual('http');
  });

  it('can get registration metadata', async () => {
    expect(service.getMetadata()).toEqual(metadata);
    service = new DefaultServiceInstance({
      instanceId,
      serviceId,
      host,
      port,
      secure: false,
    });
    expect(service.getMetadata()).toEqual(new Map());
  });
});
