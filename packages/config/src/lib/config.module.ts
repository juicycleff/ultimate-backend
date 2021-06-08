/*******************************************************************************
 * Copyright (c) 2021. Rex Isaac Raphael
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * File name:         config.module.ts
 * Last modified:     06/02/2021, 18:06
 ******************************************************************************/

import { Module, DynamicModule, Provider, Type, Global } from '@nestjs/common';
import {
  ConfigModuleAsyncOptions,
  ConfigModuleOptions,
  ConfigModuleOptionsFactory,
} from './interfaces';
import {
  CONFIG_CONFIGURATION_OPTIONS,
  CONFIG_MODULE_OPTIONS,
} from './config.constant';
import { configSourceProviders } from './utils';
import { ConfigOptions } from './config-options';
import { ConfigStore } from './config.store';
import { DiscoveryModule } from '@nestjs/core';
import { ConfigMetadataAccessor } from './config-metadata.accessor';
import { ConfigOrchestrator } from './config.orchestrator';
import { ConfigDiscovery } from './config.discovery';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [ConfigMetadataAccessor, ConfigOrchestrator],
})
export class ConfigModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    const providers = [
      {
        provide: CONFIG_CONFIGURATION_OPTIONS,
        useValue: options,
      },
      ConfigOptions,
      ...configSourceProviders(options),
      ConfigDiscovery,
      ConfigStore,
    ];

    return {
      module: ConfigModule,
      providers,
      global: options.global || true,
      exports: [ConfigStore],
    };
  }

  static forRootAsync(options: ConfigModuleAsyncOptions): DynamicModule {
    let providers = [];

    const configProvider: Provider = {
      provide: CONFIG_CONFIGURATION_OPTIONS,
      useFactory: async (modOptions: ConfigModuleOptions) => {
        providers = configSourceProviders(modOptions);
        return modOptions;
      },
      inject: [CONFIG_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: ConfigModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        ...providers,
        configProvider,
        ConfigOptions,
        ConfigDiscovery,
        ConfigStore,
      ],
      global: options.global || true,
    };
  }

  private static createAsyncProviders(
    options: ConfigModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProviders(options)];
    }

    const useClass = options.useExisting as Type<ConfigModuleOptionsFactory>;

    return [
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProviders(
    options: ConfigModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        useFactory: options.useFactory,
        inject: options.inject,
        provide: CONFIG_MODULE_OPTIONS,
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<ConfigModuleOptionsFactory>,
    ];

    return {
      provide: CONFIG_MODULE_OPTIONS,
      useFactory: async (optionsFactory: ConfigModuleOptionsFactory) =>
        await optionsFactory.createConfigOptions(),
      inject,
    };
  }
}
