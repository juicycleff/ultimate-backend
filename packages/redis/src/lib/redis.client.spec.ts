import { Test } from '@nestjs/testing';
import { RedisClient } from './redis.client';
import { REDIS_CONFIG_OPTIONS } from './redis.constant';
import { RedisModuleOptions } from './redis-module.options';
import { RedisConfig } from './redis.config';

describe('RedisClient', () => {
  let service: RedisClient;

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
        RedisClient,
      ],
    }).compile();

    service = module.get(RedisClient);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
