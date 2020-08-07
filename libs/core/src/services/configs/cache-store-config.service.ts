import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
} from '@nestjs/common';
import { InjectConfig } from '@nestcloud/config';
import { Etcd3 } from 'etcd3';
import { EtcdConfig } from '@nestcloud/config/etcd-config';
import redisStore from 'cache-manager-redis-store';
import * as redis from 'redis';

@Injectable()
export class CacheStoreConfigService implements CacheOptionsFactory {
  ty: Etcd3;
  constructor(@InjectConfig() private readonly config: EtcdConfig) {}

  createCacheOptions(): Promise<CacheModuleOptions> | CacheModuleOptions {
    const database = this.config.get<redis.RedisOptions>('database.redis');
    const caching = this.config.get<{ ttl: number; max: number }>(
      'app.caching',
    );

    if (database?.password === '') {
      delete database.password;
    }

    return {
      store: redisStore,
      ttl: caching?.ttl, // seconds
      max: caching?.max, // maximum number of items in cache
      options: {
        ...database,
      },
    };
  }
}
