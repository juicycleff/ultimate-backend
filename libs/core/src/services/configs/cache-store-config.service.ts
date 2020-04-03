import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';
import { InjectConfig, ConsulConfig } from '@nestcloud/config';
import memcachedStore from 'cache-manager-memcached-store';
import { IMemcachedOptions } from '@nestcloud/memcached';

@Injectable()
export class CacheStoreConfigService implements CacheOptionsFactory {
  constructor(
    @InjectConfig() private readonly config: ConsulConfig,
  ) {}

  createCacheOptions(): Promise<CacheModuleOptions> | CacheModuleOptions {
    const database = this.config.get<IMemcachedOptions>('memcached');

    return {
      store: memcachedStore,
      options: {
        hosts: database.uri,
      },
    };
  }
}
