import { Test } from '@nestjs/testing';
import { EtcdClient } from './etcd.client';
import { ETCD_CONFIG_OPTIONS } from './etcd.constant';
import { EtcdModuleOptions } from './etcd-module.options';

describe('EtcdClient', () => {
  let service: EtcdClient;
  let mock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ETCD_CONFIG_OPTIONS,
          useValue: {} as EtcdModuleOptions,
        },
        EtcdClient,
      ],
    }).compile();

    service = module.get(EtcdClient);
    mock = service.mock({ exec: jest.fn() });

    mock.exec.mockResolvedValue({ kvs: [{ key: 'foo', value: 'bar' }] });
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  afterAll(() => {
    service.unmock();
  });
});
