import { ModuleMetadata, Type } from '@nestjs/common';
import { RegistryClients } from './registry-clients';

export interface SwineServiceOptions {
  id?: string;
  name?: string;
  registry: RegistryClients;
  discovery: {
    hostname: string;
    port?: number;
  };
  maxRetry?: number;
  retryInterval?: number;
  includes?: string[];
  tags?: string[];
}

export interface SwineServiceOptionsFactory {
  createSwineServiceOptions():
    | Promise<SwineServiceOptions>
    | SwineServiceOptions;
}

/**
 * Options available when creating the module asynchronously.  You should use only one of the
 * useExisting, useClass, or useFactory options for creation.
 */
export interface SwineServiceAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /** Reuse an injectable factory class created in another module. */
  useExisting?: Type<SwineServiceOptionsFactory>;

  /**
   * Use an injectable factory class to populate the module options, such as URI and database name.
   */
  useClass?: Type<SwineServiceOptionsFactory>;

  /**
   * A factory function that will populate the module options, such as URI and database name.
   */
  useFactory?: (
    ...args: never[]
  ) => Promise<SwineServiceOptions> | SwineServiceOptions;

  /**
   * Inject any dependencies required by the Mongo module, such as a configuration service
   * that supplies the URI and database name
   */
  inject?: never[];
}
