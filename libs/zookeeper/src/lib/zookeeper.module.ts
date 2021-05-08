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
 * File name:         zookeeper.module.ts
 * Last modified:     08/02/2021, 11:17
 ******************************************************************************/

import { Module, Global, DynamicModule, Provider, Type } from '@nestjs/common';
import { ZookeeperClient } from './zookeeper.client';
import {
  ZookeeperModuleAsyncOptions,
  ZookeeperModuleOptions,
  ZookeeperModuleOptionsFactory,
} from './zookeeper-module.options';
import {
  ZOOKEEPER_CONFIG,
  ZOOKEEPER_CONFIG_OPTIONS,
  ZOOKEEPER_MODULE_OPTIONS,
} from './zookeeper.constant';
import { ZookeeperConfig } from './zookeeper.config';

@Global()
@Module({})
export class ZookeeperModule {
  static forRoot(options: ZookeeperModuleOptions): DynamicModule {
    return {
      module: ZookeeperModule,
      providers: [
        {
          provide: ZOOKEEPER_CONFIG_OPTIONS,
          useValue: options,
        },
        ZookeeperConfig,
        ZookeeperClient,
      ],
      exports: [ZookeeperClient],
      global: true,
    };
  }

  static forRootAsync(options: ZookeeperModuleAsyncOptions) {
    const configProvider: Provider = {
      provide: ZOOKEEPER_CONFIG_OPTIONS,
      useFactory: async (modOptions: ZookeeperModuleOptions) => {
        return modOptions;
      },
      inject: [ZOOKEEPER_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: ZookeeperModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        configProvider,
        ZookeeperConfig,
        ZookeeperClient,
      ],
      exports: [ZookeeperClient],
      global: true,
    };
  }

  private static createAsyncProviders(
    options: ZookeeperModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProviders(options)];
    }

    const useClass = options.useExisting as Type<ZookeeperModuleOptionsFactory>;

    return [
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProviders(
    options: ZookeeperModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        useFactory: options.useFactory,
        inject: options.inject,
        provide: ZOOKEEPER_MODULE_OPTIONS,
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<ZookeeperModuleOptionsFactory>,
    ];

    return {
      provide: ZOOKEEPER_MODULE_OPTIONS,
      useFactory: async (optionsFactory: ZookeeperModuleOptionsFactory) =>
        await optionsFactory.createClientOptions(),
      inject,
    };
  }
}
