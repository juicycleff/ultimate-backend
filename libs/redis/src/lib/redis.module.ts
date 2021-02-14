import { Module, DynamicModule, Provider, Type } from '@nestjs/common';
import { RedisService } from './redis.service';
import {
  RedisModuleAsyncOptions,
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from './redis-module.options';
import { REDIS_CONFIG_OPTIONS, REDIS_MODULE_OPTIONS } from './redis.constant';
import { RedisClusterService } from './redis-cluster.service';

@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions): DynamicModule {
    if (options.useCluster && !options.nodes) {
      throw new Error('Please provide the the [nodes] field');
    }

    const providers: Provider[] = [];

    if (options.useCluster) {
      providers.push(RedisClusterService);
    } else {
      providers.push(RedisService);
    }

    return {
      module: RedisModule,
      providers: [
        ...providers,
        {
          provide: REDIS_CONFIG_OPTIONS,
          useValue: options,
        },
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
          providers.push(RedisClusterService);
        } else {
          providers.push(RedisService);
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
        RedisService,
      ],
      exports: providers,
      global: true,
    };
  }

  private static createAsyncProviders(
    options: RedisModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProviders(options)];
    }

    const useClass = options.useExisting as Type<RedisModuleOptionsFactory>;

    return [
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProviders(
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
