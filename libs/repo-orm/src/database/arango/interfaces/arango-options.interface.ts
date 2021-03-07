import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { ArangoClientOption } from '@juicycleff/repo-orm/database';

/**
 * Options that ultimately need to be provided to create a MongoDB connection
 */
export interface ArangoModuleOptions {
  connectionName?: string;
  dbName: string;
  clientOptions: ArangoClientOption;
  tenantName?: string;
}

export interface ArangoOptionsFactory {
  createArangoOptions(): Promise<ArangoModuleOptions> | ArangoModuleOptions;
}

/**
 * Options available when creating the module asynchrously.  You should use only one of the
 * useExisting, useClass, or useFactory options for creation.
 */
export interface ArangoModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /** A unique name for the container.  If not specified, a default one will be used. */
  containerName?: string;

  /** Reuse an injectable factory class created in another module. */
  useExisting?: Type<ArangoOptionsFactory>;

  /**
   * Use an injectable factory class to populate the module options, such as URI and database name.
   */
  useClass?: Type<ArangoOptionsFactory>;

  /**
   * A factory function that will populate the module options, such as URI and database name.
   */
  useFactory?: (
    ...args: any[]
  ) => Promise<ArangoModuleOptions> | ArangoModuleOptions;

  /**
   * Inject any dependencies required by the Mongo module, such as a configuration service
   * that supplies the URI and database name
   */
  inject?: any[];
}
