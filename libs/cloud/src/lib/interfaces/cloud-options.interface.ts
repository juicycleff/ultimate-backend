import { ModuleMetadata, Type } from '@nestjs/common';
import { LocalRegistryProviderOptions } from './registry';
import { ConsulRegistryProviderOptions } from './registry';

export type RegistryConfiguration =
  | ConsulRegistryProviderOptions
  | LocalRegistryProviderOptions;

export interface CloudModuleOptions {
  registry: RegistryConfiguration;
}

export interface CloudModuleOptionsFactory {
  createCloudOptions(): Promise<CloudModuleOptions> | CloudModuleOptions;
}

/**
 * Options available when creating the module asynchronously.  You should use only one of the
 * useExisting, useClass, or useFactory options for creation.
 */
export interface CloudModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /** Reuse an injectable factory class created in another module. */
  useExisting?: Type<CloudModuleOptionsFactory>;

  /**
   * Use an injectable factory class to populate the module options, such as URI and database name.
   */
  useClass?: Type<CloudModuleOptionsFactory>;

  /**
   * A factory function that will populate the module options, such as URI and database name.
   */
  useFactory?: (
    ...args: never[]
  ) => Promise<CloudModuleOptions> | CloudModuleOptions;

  /**
   * Inject any dependencies required by the Mongo module, such as a configuration service
   * that supplies the URI and database name
   */
  inject?: never[];
}
