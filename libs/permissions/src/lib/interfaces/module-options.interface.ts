import { Options } from 'oso/dist/src/types';
import { ModuleMetadata, Type } from '@nestjs/common';

export interface PolarFile {
  polar: string;
  name?: string;
  file: boolean;
}

export interface PermissionsModuleOptions {
  oso?: Options;
  polars: string | string[] | PolarFile | PolarFile[];
  debug?: boolean;
}

export interface PermissionsOptionsFactory {
  createPermissionsOptions():
    | Promise<PermissionsModuleOptions>
    | PermissionsModuleOptions;
}

/**
 * Options available when creating the module asynchronously.  You should use only one of the
 * useExisting, useClass, or useFactory options for creation.
 */
export interface PermissionsModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /** couhbase connection name. */
  connectionName?: string;

  /** Reuse an injectable factory class created in another module. */
  useExisting?: Type<PermissionsOptionsFactory>;

  /**
   * Use an injectable factory class to populate the module options, such as URI and database name.
   */
  useClass?: Type<PermissionsOptionsFactory>;

  /**
   * A factory function that will populate the module options, such as URI and database name.
   */
  useFactory?: (
    ...args: never[]
  ) => Promise<PermissionsModuleOptions> | PermissionsModuleOptions;

  /**
   * Inject any dependencies required by the Mongo module, such as a configuration service
   * that supplies the URI and database name
   */
  inject?: never[];
}
