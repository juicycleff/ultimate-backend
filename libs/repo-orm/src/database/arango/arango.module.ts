import { Module, DynamicModule } from '@nestjs/common';
import { ArangoCoreModule } from './arango-core.module';
import {
  createArangoProviders,
  createArangoEdgeProviders,
} from './arango.provider';
import { ArangoClientOption, ArangoModuleAsyncOptions } from './interfaces';

/**
 * Module for the MongoDB driver
 */
@Module({})
export class ArangoModule {
  /**
   * Inject the MongoDB driver synchronously.
   * will be used.
   * @param option
   */
  static register(option: ArangoModuleOption): DynamicModule {
    const { uri, dbName, options, connectionName } = option;
    return {
      module: ArangoModule,
      imports: [ArangoCoreModule.forRoot(uri, dbName, options, connectionName)],
    };
  }

  /**
   * Inject the MongoDB driver asynchronously, allowing any dependencies such as a configuration
   * service to be injected first.
   * @param options Options for asynchrous injection
   */
  static registerAsync(options: ArangoModuleAsyncOptions): DynamicModule {
    return {
      module: ArangoModule,
      imports: [ArangoCoreModule.forRootAsync(options)],
    };
  }

  /**
   * Inject collections.
   * @param collections An array of the names of the collections to be injected.
   * @param connectionName A unique name for the connection. If not specified, a default name
   * will be used.
   * @param edge
   */
  static forFeature(
    collections: string[] = [],
    connectionName?: string,
    edge?: boolean,
  ): DynamicModule {
    const providers = edge
      ? createArangoEdgeProviders(connectionName, collections)
      : createArangoProviders(connectionName, collections);
    return {
      module: ArangoModule,
      providers,
      exports: providers,
    };
  }
}

interface ArangoModuleOption {
  uri: string;
  dbName: string;
  options?: ArangoClientOption;
  connectionName?: string;
}
