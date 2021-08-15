import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import {
  CloudModuleAsyncOptions,
  CloudModuleOptions,
  CloudModuleOptionsFactory,
} from './interfaces';
import { getSharedProviderUtils } from './utils';
import { CLOUD_MODULE_OPTIONS } from './cloud.constants';

@Global()
@Module({})
export class CloudCoreModule {
  static forRoot(options: CloudModuleOptions): DynamicModule {
    const sharedProviders = getSharedProviderUtils(options.registry);

    return {
      module: CloudCoreModule,
      providers: sharedProviders,
      exports: sharedProviders,
    };
  }

  static forRootAsync(options: CloudModuleAsyncOptions): DynamicModule {
    let providers = [];

    const configResolverProvider: Provider = {
      provide: 'CONFIG_RESOLVER_HELPER',
      useFactory: async (moduleOptions: CloudModuleOptions) => {
        providers = getSharedProviderUtils(moduleOptions.registry);
        return null;
      },
      inject: [CLOUD_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: CloudCoreModule,
      imports: options.imports,
      providers: [...asyncProviders, configResolverProvider, ...providers],
      exports: [...providers],
    };
  }

  private static createAsyncProviders(
    options: CloudModuleAsyncOptions,
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
