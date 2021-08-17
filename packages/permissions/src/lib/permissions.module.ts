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
 * File name:         permissions.module.ts
 * Last modified:     18/01/2021, 01:12
 ******************************************************************************/

import { Module, Global, DynamicModule, Provider, Type } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { OsoService } from './oso.service';
import {
  PermissionsModuleAsyncOptions,
  PermissionsModuleOptions,
  PermissionsOptionsFactory,
} from './interfaces';
import { PERMISSION_CONFIG_OPTIONS, PERMISSION_MODULE_OPTIONS } from './permissions.constants';

@Global()
@Module({})
export class PermissionsModule {
  /**
   * create a permissions module
   * @param options {PermissionsModuleOptions}
   */
  static forRoot(options: PermissionsModuleOptions): DynamicModule {
    return {
      module: PermissionsModule,
      providers: [
        {
          provide: PERMISSION_CONFIG_OPTIONS,
          useValue: options,
        },
        PermissionsService,
        OsoService,
      ],
      exports: [PermissionsService, OsoService],
      global: true,
    };
  }

  /**
   * create an async permissions module
   * @param options {PermissionsModuleAsyncOptions}
   */
  static forRootAsync(options: PermissionsModuleAsyncOptions): DynamicModule {
    const configProvider: Provider = {
      provide: PERMISSION_CONFIG_OPTIONS,
      useFactory: async (modOptions: PermissionsModuleOptions) => {
        return modOptions;
      },
      inject: [PERMISSION_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: PermissionsModule,
      providers: [
        ...asyncProviders,
        configProvider,
        PermissionsService,
        OsoService,
      ],
      exports: [PermissionsService, OsoService],
      global: true,
    };
  }

  private static createAsyncProviders(
    options: PermissionsModuleAsyncOptions,
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
    options: PermissionsModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        useFactory: options.useFactory,
        inject: options.inject,
        provide: PERMISSION_MODULE_OPTIONS,
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<PermissionsOptionsFactory>,
    ];

    return {
      provide: PERMISSION_MODULE_OPTIONS,
      useFactory: async (optionsFactory: PermissionsOptionsFactory) =>
        await optionsFactory.createPermissionsOptions(),
      inject,
    };
  }
}
