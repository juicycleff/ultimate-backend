import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import {
  CloudModuleAsyncOptions,
  CloudModuleOptions,
  CloudModuleOptionsFactory,
} from './interfaces';
import {
  CLOUD_REGISTRY_CLIENT,
  CLOUD_REGISTRY_CONFIG,
} from './cloud.constants';
import { validateOptions } from './utils';
import { CLOUD_MODULE_OPTIONS } from './cloud.constants';

@Global()
@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class CloudCoreModule {
  static forRoot(options: CloudModuleOptions): DynamicModule {
    const registryOption = validateOptions(options.registry);

    const sharedProviders = [];

    if (registryOption.discoverer === 'consul') {
      const {
        ConsulServiceRegistry,
        ConsulDiscoveryClient,
      } = require('./discoveries/consul');

      sharedProviders.push(ConsulServiceRegistry);
      sharedProviders.push(ConsulDiscoveryClient);
    } else if (registryOption.discoverer === 'local') {
      const { MdnsServiceRegistry } = require('./discoveries/mdns');
      sharedProviders.push(MdnsServiceRegistry);
    }

    const configProvider = {
      provide: CLOUD_REGISTRY_CONFIG,
      useValue: options.registry,
    };

    sharedProviders.push(...[configProvider]);
    if (registryOption.discoverer === 'consul') {
      const {
        ConsulServiceRegistry,
        ConsulDiscoveryClient,
      } = require('./discoveries/consul');
      sharedProviders.push(ConsulServiceRegistry);
      sharedProviders.push(ConsulDiscoveryClient);
    } else if (registryOption.discoverer === 'local') {
      const { MdnsServiceRegistry } = require('./discoveries/mdns');
      sharedProviders.push(MdnsServiceRegistry);
    }

    return {
      module: CloudCoreModule,
      providers: sharedProviders,
      exports: sharedProviders,
    };
  }

  static forRootAsync(options: CloudModuleAsyncOptions): DynamicModule {
    let configProvider: Provider;
    const sharedProviders = [];

    const clientProvider: Provider = {
      provide: CLOUD_REGISTRY_CLIENT,
      useFactory: async (moduleOptions: CloudModuleOptions) => {
        configProvider = {
          provide: CLOUD_REGISTRY_CONFIG,
          useValue: moduleOptions.registry,
        };

        sharedProviders.push(configProvider);

        if (moduleOptions.registry.discoverer === 'consul') {
          const {
            ConsulServiceRegistry,
            ConsulDiscoveryClient,
          } = require('./discoveries/consul');

          sharedProviders.push(ConsulServiceRegistry);
          sharedProviders.push(ConsulDiscoveryClient);
        } else if (moduleOptions.registry.discoverer === 'local') {
          const { MdnsServiceRegistry } = require('./discoveries/mdns');
          sharedProviders.push(MdnsServiceRegistry);
          return {};
        }

        return null;
      },
      inject: [CLOUD_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: CloudCoreModule,
      imports: options.imports,
      providers: [...asyncProviders, ...sharedProviders],
      exports: [clientProvider, ...sharedProviders],
    };
  }

  private static createAsyncProviders(
    options: CloudModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProviders(options)];
    }

    const useClass = options.useExisting as Type<CloudModuleOptionsFactory>;

    return [
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProviders(
    options: CloudModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        useFactory: options.useFactory,
        inject: options.inject,
        provide: CLOUD_MODULE_OPTIONS,
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<CloudModuleOptionsFactory>,
    ];

    return {
      provide: CLOUD_MODULE_OPTIONS,
      useFactory: async (optionsFactory: CloudModuleOptionsFactory) =>
        await optionsFactory.createCloudOptions(),
      inject,
    };
  }
}
