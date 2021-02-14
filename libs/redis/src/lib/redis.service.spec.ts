import { Test } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { REDIS_CONFIG_OPTIONS } from './redis.constant';
import { RedisModuleOptions } from './redis-module.options';

describe('RedisService', () => {
  let service: RedisService;

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
        RedisService,
      ],
    }).compile();

    service = module.get(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
