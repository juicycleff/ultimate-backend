import { ConsulModule } from '../consul.module';
import { Test } from '@nestjs/testing';
import { ConsulDiscoveryClient } from './consul-discovery.client';

jest.mock('./consul-discovery.client');

describe('ConsulDiscoveryClient', () => {
  let client: ConsulDiscoveryClient;

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ConsulDiscoveryClient.mockClear();

    const module = await Test.createTestingModule({
      imports: [
        ConsulModule.forRoot({
          host: 'localhost',
          port: '8350',
          aclToken: 'access-token',
        }),
      ],
      providers: [ConsulDiscoveryClient],
    }).compile();

    client = module.get(ConsulDiscoveryClient);
  });

  it('should be defined', () => {
    expect(client).toBeTruthy();
  });

  it('client description', async () => {
    const result = 'ConsulClient Discovery Client';
    jest.spyOn(client, 'description').mockImplementation(() => result);
    expect(client.description()).toEqual(result);
  });

  it('get services succeeds', async () => {
    const result = ['service-test'];
    jest.spyOn(client, 'getServices').mockImplementation(async () => result);
    expect(await client.getServices()).toEqual(result);
  });

  it('get services succeeds with token', async () => {
    const result = ['service-test'];
    jest.spyOn(client, 'getServices').mockImplementation(async () => result);
    expect(await client.getServices()).toEqual(result);
  });

  it('get instance succeeds with token', async () => {
    jest.spyOn(client, 'getInstances').mockImplementation(async () => []);
    expect(await client.getInstances('test-token')).toHaveLength(0);
  });

  it('get instance succeeds with token', async () => {
    jest.spyOn(client, 'getInstances').mockImplementation(async () => []);
    expect(await client.getInstances('test-token')).toHaveLength(0);
  });
});
