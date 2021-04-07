import { Test } from '@nestjs/testing';
import { EtcdClient } from './etcd.client';
import { ETCD_CONFIG_OPTIONS } from './etcd.constant';
import { EtcdModuleOptions } from './etcd-module.options';
import { EtcdConfig } from './etcd.config';

describe('EtcdClient', () => {
  let service: EtcdClient;
  let mock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ETCD_CONFIG_OPTIONS,
          useValue: {
            etcdOptions: {
              hosts: 'localhost:2379',
            },
          } as EtcdModuleOptions,
        },
        EtcdConfig,
        EtcdClient,
      ],
    }).compile();

    await module.init();
    service = module.get(EtcdClient);
    mock = service.client.mock({ exec: jest.fn() });

    mock.exec.mockResolvedValue({ kvs: [{ key: 'foo', value: 'bar' }] });
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  afterAll(() => {
    if (service.client) {
      service.client.unmock();
    }
  });
});
