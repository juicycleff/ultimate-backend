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
 * File name:         etcd.module.ts
 * Last modified:     07/02/2021, 12:13
 ******************************************************************************/

import { Module, Global, DynamicModule, Provider, Type } from '@nestjs/common';
import {
  EtcdModuleAsyncOptions,
  EtcdModuleOptions,
  EtcdModuleOptionsFactory,
} from './etcd-module.options';
import { ETCD_CONFIG_OPTIONS, ETCD_MODULE_OPTIONS } from './etcd.constant';
import { EtcdService } from './etcd.service';

@Global()
@Module({})
export class EtcdModule {
  static forRoot(options: EtcdModuleOptions): DynamicModule {
    return {
      module: EtcdModule,
      providers: [
        EtcdService,
        {
          provide: ETCD_CONFIG_OPTIONS,
          useValue: options,
        },
      ],
      exports: [EtcdService],
      global: options.global || true,
    };
  }

  static forRootAsync(options: EtcdModuleAsyncOptions) {
    const providers: Provider[] = [EtcdService];

    const configProvider: Provider = {
      provide: ETCD_CONFIG_OPTIONS,
      useFactory: async (modOptions: EtcdModuleOptions) => {
        return modOptions;
      },
      inject: [ETCD_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: EtcdModule,
      imports: options.imports,
      providers: [...asyncProviders, ...providers, configProvider, EtcdService],
      exports: providers,
      global: true,
    };
  }

  private static createAsyncProviders(
    options: EtcdModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProviders(options)];
    }

    const useClass = options.useExisting as Type<EtcdModuleOptionsFactory>;

    return [
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProviders(
    options: EtcdModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        useFactory: options.useFactory,
        inject: options.inject,
        provide: ETCD_MODULE_OPTIONS,
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<EtcdModuleOptionsFactory>,
    ];

    return {
      provide: ETCD_MODULE_OPTIONS,
      useFactory: async (optionsFactory: EtcdModuleOptionsFactory) =>
        await optionsFactory.createClientOptions(),
      inject,
    };
  }
}
