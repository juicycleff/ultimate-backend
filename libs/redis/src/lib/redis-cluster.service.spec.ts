import { Test } from '@nestjs/testing';
import { RedisClusterService } from './redis-cluster.service';
import { REDIS_CONFIG_OPTIONS } from './redis.constant';
import { RedisModuleOptions } from './redis-module.options';

describe('RedisClusterService', () => {
  let service: RedisClusterService;

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
        RedisClusterService,
      ],
    }).compile();

    service = module.get(RedisClusterService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
