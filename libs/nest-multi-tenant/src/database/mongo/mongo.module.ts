import { Module, DynamicModule } from '@nestjs/common';
import { MongoCoreModule } from './mongo-core.module';
import { MongoClientOptions } from 'mongodb';
import { createMongoProviders } from './mongo.provider';
import { MongoModuleAsyncOptions } from './interfaces';

/**
 * Module for the MongoDB driver
 */
@Module({})
export class MongoModule {
  /**
   * Inject the MongoDB driver synchronously.
   * @param uri The database URI
   * @param dbName The database name
   * @param options Options for the MongoClient that will be created
   * @param connectionName A unique name for the connection.  If not specified, a default name
   * will be used.
   */
  static forRoot(
    uri: string,
    dbName: string,
    options?: MongoClientOptions,
    connectionName?: string,
  ): DynamicModule {
    return {
      module: MongoModule,
      imports: [
        MongoCoreModule.forRoot(uri, dbName, options, connectionName),
      ],
    };
  }

  /**
   * Inject the MongoDB driver asynchronously, allowing any dependencies such as a configuration
   * service to be injected first.
   * @param options Options for asynchrous injection
   */
  static forRootAsync(options: MongoModuleAsyncOptions): DynamicModule {
    return {
      module: MongoModule,
      imports: [MongoCoreModule.forRootAsync(options)],
    };
  }

  /**
   * Inject collections.
   * @param collections An array of the names of the collections to be injected.
   * @param connectionName A unique name for the connection. If not specified, a default name
   * will be used.
   */
  static forFeature(
    collections: string[] = [],
    connectionName?: string,
  ): DynamicModule {
    const providers = createMongoProviders(connectionName, collections);
    return {
      module: MongoModule,
      providers: providers,
      exports: providers,
    };
  }
}
