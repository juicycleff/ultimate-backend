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
 * File name:         bootstrap.module.ts
 * Last modified:     26/03/2021, 14:02
 ******************************************************************************/

import { DynamicModule, Module, Global, Provider, Type } from '@nestjs/common';
import { BootstrapStore } from './bootstrap.store';
import { DiscoveryModule } from '@nestjs/core';
import { assign } from 'lodash';
import { BootConfigSourceLoader } from './boot-config-source.loader';
import {
  BootstrapModuleAsyncOptions,
  BootstrapModuleOptions,
  BootstrapModuleOptionsFactory,
} from './boostrap-module.options';
import {
  BOOTSTRAP_CONFIGURATION_OPTIONS,
  BOOTSTRAP_MODULE_OPTIONS,
} from './bootstrap.constant';
import { BootstrapMetadataAccessor } from './bootstrap-metadata.accessor';
import { BootstrapDiscovery } from './bootstrap.discovery';
import { BootstrapOrchestrator } from './bootstrap.orchestrator';
import { BootConfig } from './boot-config.class';
import * as path from 'path';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [BootstrapMetadataAccessor, BootstrapOrchestrator],
})
export class BootstrapModule {
  static forRoot(options?: BootstrapModuleOptions): DynamicModule {
    const bootOptionsProvider = {
      provide: BOOTSTRAP_CONFIGURATION_OPTIONS,
      useValue: assign(
        {
          filePath: path.resolve(__dirname, 'assets/bootstrap.yaml'),
          debug: false,
          disableEnv: true,
        },
        options
      ),
    };

    return {
      global: true,
      module: BootstrapModule,
      providers: [
        bootOptionsProvider,
        BootConfig,
        BootConfigSourceLoader,
        BootstrapStore,
        BootstrapDiscovery,
      ],
      exports: [BootConfig],
    };
  }

  static forRootAsync(options: BootstrapModuleAsyncOptions): DynamicModule {
    const providers = [];

    const configProvider: Provider = {
      provide: BOOTSTRAP_CONFIGURATION_OPTIONS,
      useFactory: async (modOptions: BootstrapModuleOptions) => {
        return modOptions;
      },
      inject: [BOOTSTRAP_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      global: true,
      module: BootstrapModule,
      imports: options.imports,
      providers: [
        BootConfig,
        ...asyncProviders,
        ...providers,
        configProvider,
        BootConfigSourceLoader,
        BootstrapStore,
        BootstrapDiscovery,
      ],
      exports: [BootConfig],
    };
  }

  private static createAsyncProviders(
    options: BootstrapModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProviders(options)];
    }

    const useClass = options.useExisting as Type<BootstrapModuleOptionsFactory>;

    return [
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProviders(
    options: BootstrapModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        useFactory: options.useFactory,
        inject: options.inject,
        provide: BOOTSTRAP_MODULE_OPTIONS,
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<BootstrapModuleOptionsFactory>,
    ];

    return {
      provide: BOOTSTRAP_MODULE_OPTIONS,
      useFactory: async (optionsFactory: BootstrapModuleOptionsFactory) =>
        await optionsFactory.createConfigOptions(),
      inject,
    };
  }
}
