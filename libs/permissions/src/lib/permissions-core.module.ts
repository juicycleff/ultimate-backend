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
 * File name:         permissions-core.module.ts
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
import { PERMISSION_MODULE_OPTIONS } from './permissions.constants';

@Global()
@Module({
  controllers: [],
  providers: [PermissionsService, OsoService],
  exports: [PermissionsService, OsoService],
})
export class PermissionsCoreModule {
  static forRoot(options: PermissionsModuleOptions): DynamicModule {
    const permissionModuleOptionsProvider: Provider = {
      provide: PERMISSION_MODULE_OPTIONS,
      useValue: options,
    };

    return {
      module: PermissionsCoreModule,
      providers: [permissionModuleOptionsProvider],
    };
  }

  static forRootAsync(options: PermissionsModuleAsyncOptions): DynamicModule {
    const permissionModuleOptionsProvider: Provider = {
      provide: PERMISSION_MODULE_OPTIONS,
      useValue: options,
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: PermissionsCoreModule,
      providers: [...asyncProviders, permissionModuleOptionsProvider],
    };
  }

  private static createAsyncProviders(
    options: PermissionsModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProviders(options)];
    }

    const useClass = options.useExisting as Type<PermissionsOptionsFactory>;

    return [
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProviders(
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
