import { Test } from '@nestjs/testing';
import { EtcdService } from './etcd.service';
import { ETCD_CONFIG_OPTIONS } from './etcd.constant';
import { EtcdModuleOptions } from './etcd-module.options';

describe('EtcdService', () => {
  let service: EtcdService;
  let mock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ETCD_CONFIG_OPTIONS,
          useValue: {} as EtcdModuleOptions,
        },
        EtcdService,
      ],
    }).compile();

    service = module.get(EtcdService);
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
