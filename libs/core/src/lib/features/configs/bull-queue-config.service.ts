import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
} from '@nestjs/common';
import { InjectConfig } from '@nestcloud/config';
import { KubernetesConfig } from '@nestcloud/config/config.kubernetes';
import { RedisOptions } from 'redis';
import {
  BullModuleOptions,
  BullOptionsFactory,
} from '@nestjs/bull/dist/interfaces/bull-module-options.interface';

@Injectable()
export class BullQueueConfigService implements BullOptionsFactory {
  constructor(@InjectConfig() private readonly config: KubernetesConfig) {}

  createBullOptions(): Promise<BullModuleOptions> | BullModuleOptions {
    const redis = this.config.get<RedisOptions>('database.redis');
    const caching = this.config.get<{ name: string }>('app.queue');

    if (redis?.password === '') {
      delete redis.password;
    }

    return {
      name: caching.name,
      redis,
    };
  }
}
