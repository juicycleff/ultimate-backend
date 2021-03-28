import { Test } from '@nestjs/testing';
import { RedisClusterClient } from './redis-cluster.client';
import { REDIS_CONFIG_OPTIONS } from './redis.constant';
import { RedisModuleOptions } from './redis-module.options';
import { RedisConfig } from './redis.config';

describe('RedisClusterService', () => {
  let service: RedisClusterClient;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: REDIS_CONFIG_OPTIONS,
          useValue: {
            redisOptions: {
              host: 'localhost',
              port: 6379,
              db: 0,
            },
          } as RedisModuleOptions,
        },
        RedisConfig,
        RedisClusterClient,
      ],
    }).compile();

    service = module.get(RedisClusterClient);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
