import { Module, DynamicModule, Provider, Type } from '@nestjs/common';
import { RedisClient } from './redis.client';
import {
  RedisModuleAsyncOptions,
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from './redis-module.options';
import { REDIS_CONFIG_OPTIONS, REDIS_MODULE_OPTIONS } from './redis.constant';
import { RedisClusterClient } from './redis-cluster.client';
import { RedisConfig } from './redis.config';

@Module({})
export class RedisModule {
  static forRoot(options?: RedisModuleOptions): DynamicModule {
    if (options.useCluster && !options.nodes) {
      throw new Error('Please provide the [nodes] option');
    }

    const providers: Provider[] = [];

    if (options.useCluster) {
      providers.push(RedisClusterClient);
    } else {
      providers.push(RedisClient);
    }

    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_CONFIG_OPTIONS,
          useValue: options,
        },
        RedisConfig,
        ...providers,
      ],
      exports: providers,
      global: options.global || true,
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions) {
    const providers: Provider[] = [];

    const configProvider: Provider = {
      provide: REDIS_CONFIG_OPTIONS,
      useFactory: async (modOptions: RedisModuleOptions) => {
        if (modOptions.useCluster) {
          providers.push(RedisClusterClient);
        } else {
          providers.push(RedisClient);
        }
        return modOptions;
      },
      inject: [REDIS_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: RedisModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        ...providers,
        configProvider,
        RedisConfig,
        RedisClient,
      ],
      exports: providers,
      global: true,
    };
  }

  private static createAsyncProviders(
    options: RedisModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: RedisModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        useFactory: options.useFactory,
        inject: options.inject,
        provide: REDIS_MODULE_OPTIONS,
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<RedisModuleOptionsFactory>,
    ];

    return {
      provide: REDIS_MODULE_OPTIONS,
      useFactory: async (optionsFactory: RedisModuleOptionsFactory) =>
        await optionsFactory.createClientOptions(),
      inject,
    };
  }
}
