import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { BrakesModuleAsyncOptions, BrakesModuleOptions, BrakesModuleOptionsFactory } from './brakes-module.options';
import { BrakesFactory } from './brakes.factory';
import { BrakesResolver } from './brakes.resolver';
import { Brakes } from './brakes.class';
import { BRAKES_CONFIG_OPTIONS, BRAKES_MODULE_OPTIONS } from './brakes.constants';

@Module({})
export class BrakesModule {

  static forRoot(options?: BrakesModuleOptions): DynamicModule {
    const configProvider: Provider = {
      provide: BRAKES_CONFIG_OPTIONS,
      useValue: options || {},
    };

    return {
      module: BrakesModule,
      providers: [configProvider, Brakes, BrakesFactory, BrakesResolver],
      exports: [Brakes],
      global: options?.global || true
    }
  }

  static forRootAsync(options: BrakesModuleAsyncOptions): DynamicModule {
    const configProvider: Provider = {
      provide: BRAKES_CONFIG_OPTIONS,
      useFactory: async (modOptions: BrakesModuleOptions) => {
        return modOptions;
      },
      inject: [BRAKES_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: BrakesModule,
      providers: [...asyncProviders, configProvider, Brakes, BrakesFactory, BrakesResolver],
      exports: [Brakes],
    }
  }

  private static createAsyncProviders(
    options: BrakesModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProviders(options)];
    }

    const useClass = options.useExisting as Type<BrakesModuleOptionsFactory>;

    return [
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProviders(
    options: BrakesModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        useFactory: options.useFactory,
        inject: options.inject,
        provide: BRAKES_MODULE_OPTIONS,
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<BrakesModuleOptionsFactory>,
    ];

    return {
      provide: BRAKES_MODULE_OPTIONS,
      useFactory: async (optionsFactory: BrakesModuleOptionsFactory) =>
        await optionsFactory.createClientOptions(),
      inject,
    };
  }
}
