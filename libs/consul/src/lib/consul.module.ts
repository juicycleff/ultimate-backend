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
 * File name:         consul.module.ts
 * Last modified:     21/01/2021, 00:54
 ******************************************************************************/

import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { ConsulService } from './consul.service';
import {
  ConsulModuleAsyncOptions,
  ConsulModuleOptions,
  ConsulModuleOptionsFactory,
} from './consul-module.options';
import {
  CONSUL_CONFIG_OPTIONS,
  CONSUL_MODULE_OPTIONS,
} from './consul.constant';

@Global()
@Module({})
export class ConsulModule {
  static forRoot(options: ConsulModuleOptions): DynamicModule {
    const providers = [
      {
        provide: CONSUL_CONFIG_OPTIONS,
        useValue: options,
      },
      ConsulService,
    ];

    return {
      module: ConsulModule,
      providers,
      exports: providers,
      global: true,
    };
  }

  static forRootAsync(options: ConsulModuleAsyncOptions) {
    const asyncProviders = this.createAsyncProviders(options);

    const configProvider: Provider = {
      provide: CONSUL_CONFIG_OPTIONS,
      useFactory: async (modOptions: ConsulModuleOptions) => {
        return modOptions;
      },
      inject: [CONSUL_MODULE_OPTIONS],
    };

    return {
      module: ConsulModule,
      imports: options.imports,
      providers: [...asyncProviders, configProvider, ConsulService],
      exports: [ConsulService],
      global: true,
    };
  }

  private static createAsyncProviders(
    options: ConsulModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProviders(options)];
    }

    const useClass = options.useExisting as Type<ConsulModuleOptionsFactory>;

    return [
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProviders(
    options: ConsulModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        useFactory: options.useFactory,
        inject: options.inject,
        provide: CONSUL_MODULE_OPTIONS,
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<ConsulModuleOptionsFactory>,
    ];

    return {
      provide: CONSUL_MODULE_OPTIONS,
      useFactory: async (optionsFactory: ConsulModuleOptionsFactory) =>
        await optionsFactory.createClientOptions(),
      inject,
    };
  }
}
