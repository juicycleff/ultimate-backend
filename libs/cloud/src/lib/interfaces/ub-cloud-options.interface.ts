import { ModuleMetadata, Type } from '@nestjs/common';
import { LocalRegistryProviderOptions } from './registry';
import { ConsulRegistryProviderOptions } from './registry';

export type RegistryConfiguration =
  | ConsulRegistryProviderOptions
  | LocalRegistryProviderOptions;

export interface UBCloudOptions {
  registry: RegistryConfiguration;
}

export interface UBCloudOptionsFactory {
  createUBCloudOptions(): Promise<UBCloudOptions> | UBCloudOptions;
}

/**
 * Options available when creating the module asynchronously.  You should use only one of the
 * useExisting, useClass, or useFactory options for creation.
 */
export interface UBCloudAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /** Reuse an injectable factory class created in another module. */
  useExisting?: Type<UBCloudOptionsFactory>;

  /**
   * Use an injectable factory class to populate the module options, such as URI and database name.
   */
  useClass?: Type<UBCloudOptionsFactory>;

  /**
   * A factory function that will populate the module options, such as URI and database name.
   */
  useFactory?: (...args: never[]) => Promise<UBCloudOptions> | UBCloudOptions;

  /**
   * Inject any dependencies required by the Mongo module, such as a configuration service
   * that supplies the URI and database name
   */
  inject?: never[];
}
