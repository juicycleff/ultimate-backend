import { Module, DynamicModule } from '@nestjs/common';
import { PermissionsCoreModule } from './permissions-core.module';
import { PermissionsModuleAsyncOptions, PermissionsModuleOptions } from './interfaces';

@Module({})
export class PermissionsModule {

  /**
   * create a permissions module
   * @param options {PermissionsModuleOptions}
   */
  static forRoot(options: PermissionsModuleOptions): DynamicModule {
    return {
      module: PermissionsCoreModule,
      imports: [PermissionsCoreModule.forRoot(options)],
    };
  }

  /**
   * create an async permissions module
   * @param options {PermissionsModuleAsyncOptions}
   */
  static forRootAsync(options: PermissionsModuleAsyncOptions): DynamicModule {
    return {
      module: PermissionsCoreModule,
      imports: [PermissionsCoreModule.forRootAsync(options)],
    };
  }
}
