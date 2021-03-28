import { Test } from '@nestjs/testing';
import { ZookeeperClient } from './zookeeper.client';
import { ZOOKEEPER_CONFIG_OPTIONS } from './zookeeper.constant';
import { ZookeeperModuleOptions } from './zookeeper-module.options';
import { ZookeeperConfig } from './zookeeper.config';

describe('ZookeeperService', () => {
  let service: ZookeeperClient;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ZOOKEEPER_CONFIG_OPTIONS,
          useValue: {
            host: '127.0.0.1:2181',
          } as ZookeeperModuleOptions,
        },
        ZookeeperConfig,
        ZookeeperClient,
      ],
    }).compile();

    await module.init();
    service = module.get(ZookeeperClient);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
