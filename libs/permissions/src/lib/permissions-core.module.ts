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
