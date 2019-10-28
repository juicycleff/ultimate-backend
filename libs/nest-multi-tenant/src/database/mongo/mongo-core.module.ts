import { ModuleRef } from '@nestjs/core';
import { DynamicModule, Global, Inject, Module, OnModuleDestroy, Provider } from '@nestjs/common';
import { MongoClient, MongoClientOptions } from 'mongodb';
import * as hash from 'object-hash';

import { getClientToken, getContainerToken, getDbToken } from './mongo.util';
import { DEFAULT_MONGO_CLIENT_OPTIONS, DEFAULT_MONGO_CONTAINER_NAME, MONGO_CONTAINER_NAME, MONGO_MODULE_OPTIONS } from './mongo.constants';
import { MongoModuleAsyncOptions, MongoModuleOptions, MongoOptionsFactory } from './interfaces/mongo-options.interface';
import { NestMultiTenantModule } from '@juicycleff/nest-multi-tenant/nest-multi-tenant.module';

@Global()
@Module({
  imports: [NestMultiTenantModule],
})
export class MongoCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(MONGO_CONTAINER_NAME) private readonly containerName: string,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(
    uri: string,
    dbName: string,
    clientOptions: MongoClientOptions = DEFAULT_MONGO_CLIENT_OPTIONS,
    containerName: string = DEFAULT_MONGO_CONTAINER_NAME,
  ): DynamicModule {

    const containerNameProvider = {
      provide: MONGO_CONTAINER_NAME,
      useValue: containerName,
    };

    const connectionContainerProvider = {
      provide: getContainerToken(containerName),
      useFactory: () => new Map<any, MongoClient>(),
    };

    const clientProvider = {
      provide: getClientToken(containerName),
      useFactory: async (connections: Map<any, MongoClient>) => {
        const key = hash.sha1({
          uri,
          clientOptions,
        });
        if (connections.has(key)) {
          return connections.get(key);
        }
        const client = new MongoClient(uri, clientOptions);
        connections.set(key, client);
        return await client.connect();
      },
      inject: [getContainerToken(containerName)],
    };

    const dbProvider = {
      provide: getDbToken(containerName),
      useFactory: (client: MongoClient) => client.db(dbName),
      inject: [getClientToken(containerName)],
    };

    return {
      module: MongoCoreModule,
      providers: [
        containerNameProvider,
        connectionContainerProvider,
        clientProvider,
        dbProvider,
      ],
      exports: [clientProvider, dbProvider],
    };
  }

  static forRootAsync(options: MongoModuleAsyncOptions): DynamicModule {
    const mongoContainerName =
      options.containerName || DEFAULT_MONGO_CONTAINER_NAME;

    const containerNameProvider = {
      provide: MONGO_CONTAINER_NAME,
      useValue: mongoContainerName,
    };

    const connectionContainerProvider = {
      provide: getContainerToken(mongoContainerName),
      useFactory: () => new Map<any, MongoClient>(),
    };

    const clientProvider = {
      provide: getClientToken(mongoContainerName),
      useFactory: async (
        connections: Map<any, MongoClient>,
        mongoModuleOptions: MongoModuleOptions,
      ) => {
        const { uri, clientOptions } = mongoModuleOptions;
        const key = hash.sha1({
          uri,
          clientOptions,
        });
        if (connections.has(key)) {
          return connections.get(key);
        }
        const client = new MongoClient(
          uri,
          clientOptions || DEFAULT_MONGO_CLIENT_OPTIONS,
        );
        connections.set(key, client);
        return await client.connect();
      },
      inject: [getContainerToken(mongoContainerName), MONGO_MODULE_OPTIONS],
    };

    const dbProvider = {
      provide: getDbToken(mongoContainerName),
      useFactory: (
        mongoModuleOptions: MongoModuleOptions,
        client: MongoClient,
      ) => client.db(mongoModuleOptions.dbName),
      inject: [MONGO_MODULE_OPTIONS, getClientToken(mongoContainerName)],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: MongoCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        clientProvider,
        dbProvider,
        containerNameProvider,
        connectionContainerProvider,
      ],
      exports: [clientProvider, dbProvider],
    };
  }

  async onModuleDestroy() {
    const clientsMap: Map<any, MongoClient> = this.moduleRef.get<
      Map<any, MongoClient>
      >(getContainerToken(this.containerName));

    if (clientsMap) {
      await Promise.all(
        [...clientsMap.values()].map(connection => connection.close()),
      );
    }
  }

  private static createAsyncProviders(
    options: MongoModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    } else if (options.useClass) {
      return [
        this.createAsyncOptionsProvider(options),
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    } else {
      return [];
    }
  }

  private static createAsyncOptionsProvider(
    options: MongoModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MONGO_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    } else if (options.useExisting) {
      return {
        provide: MONGO_MODULE_OPTIONS,
        useFactory: async (optionsFactory: MongoOptionsFactory) =>
          await optionsFactory.createMongoOptions(),
        inject: [options.useExisting],
      };
    } else if (options.useClass) {
      return {
        provide: MONGO_MODULE_OPTIONS,
        useFactory: async (optionsFactory: MongoOptionsFactory) =>
          await optionsFactory.createMongoOptions(),
        inject: [options.useClass],
      };
    } else {
      throw new Error('Invalid MongoModule options');
    }
  }
}
