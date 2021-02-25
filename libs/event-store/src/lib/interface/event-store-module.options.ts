import { BaseClientOptions } from '@ultimate-backend/common';
import { ModuleMetadata, Type } from '@nestjs/common';

import { EventStoreClientOptions } from './event-store-client.options';
import { StanClientOptions } from './stan-client.options';

export type BrokerOptions = EventStoreClientOptions | StanClientOptions;

export interface EventStoreModuleOptions extends BaseClientOptions {
  broker: BrokerOptions;

  global?: boolean;
}

export interface EventStoreModuleOptionsFactory {
  createEventStoreOptions():
    | Promise<EventStoreModuleOptions>
    | EventStoreModuleOptions;
}

/**
 * Options available when creating the module asynchronously. You should use only one of the
 * useExisting, useClass, or useFactory options for creation.
 */
export interface EventStoreModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /** Reuse an injectable factory class created in another module. */
  useExisting?: Type<EventStoreModuleOptionsFactory>;

  /**
   * Use an injectable factory class to populate the module options, such as URI and database name.
   */
  useClass?: Type<EventStoreModuleOptionsFactory>;

  /**
   * A factory function that will populate the module options, such as URI and database name.
   */
  useFactory?: (
    ...args: never[]
  ) => Promise<EventStoreModuleOptions> | EventStoreModuleOptions;

  /**
   * Inject any dependencies required by the module, such as a configuration service
   * that supplies the URI and database name
   */
  inject?: never[];

  global?: boolean;
}
