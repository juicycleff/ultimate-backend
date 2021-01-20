import { ModuleMetadata, Type } from '@nestjs/common';
import { ConsulOptions } from 'consul';

export interface ConsulModuleOptions extends ConsulOptions {
  debug?: boolean;
  aclToken?: string;
  passing?: boolean;
}

export interface ConsulModuleOptionsFactory {
  createClientOptions(): Promise<ConsulModuleOptions> | ConsulModuleOptions;
}

/**
 * Options available when creating the module asynchronously. You should use only one of the
 * useExisting, useClass, or useFactory options for creation.
 */
export interface ConsulModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /** Reuse an injectable factory class created in another module. */
  useExisting?: Type<ConsulModuleOptionsFactory>;

  /**
   * Use an injectable factory class to populate the module options, such as URI and database name.
   */
  useClass?: Type<ConsulModuleOptionsFactory>;

  /**
   * A factory function that will populate the module options, such as URI and database name.
   */
  useFactory?: (
    ...args: never[]
  ) => Promise<ConsulModuleOptions> | ConsulModuleOptions;

  /**
   * Inject any dependencies required by the Mongo module, such as a configuration service
   * that supplies the URI and database name
   */
  inject?: never[];
}
