import { ModuleRef } from '@nestjs/core';
import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import { MongoClient, MongoClientOptions } from 'mongodb';
import * as hash from 'object-hash';
import {
  DEFAULT_MONGO_CLIENT_OPTIONS,
  MONGO_MODULE_OPTIONS,
} from '../../database';

import {
  getClientToken,
  getContainerTenantConfig,
  getContainerToken,
  getCurrentTenantToken,
  getDbToken,
} from '../../utils';
import {
  DEFAULT_DATABASE_CONTAINER_NAME,
  DATABASE_CONTAINER_NAME,
} from '../../constants';
import {
  MongoModuleAsyncOptions,
  MongoModuleOptions,
  MongoOptionsFactory,
} from './interfaces';

@Global()
@Module({})
export class MongoCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(DATABASE_CONTAINER_NAME) private readonly containerName: string,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(
    uri: string,
    dbName: string,
    clientOptions: MongoClientOptions = DEFAULT_MONGO_CLIENT_OPTIONS,
    containerName: string = DEFAULT_DATABASE_CONTAINER_NAME,
  ): DynamicModule {
    const containerNameProvider = {
      provide: DATABASE_CONTAINER_NAME,
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

    const currentTenantProvider = {
      provide: getCurrentTenantToken(containerName),
      useValue: {
        tenantId: null,
      },
      inject: [getClientToken(containerName)],
    };

    return {
      module: MongoCoreModule,
      providers: [
        containerNameProvider,
        connectionContainerProvider,
        clientProvider,
        dbProvider,
        currentTenantProvider,
      ],
      exports: [clientProvider, dbProvider, currentTenantProvider],
    };
  }

  static forRootAsync(options: MongoModuleAsyncOptions): DynamicModule {
    const mongoContainerName =
      options.containerName || DEFAULT_DATABASE_CONTAINER_NAME;

    const containerNameProvider = {
      provide: DATABASE_CONTAINER_NAME,
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
      exports: [...asyncProviders, clientProvider, dbProvider],
    };
  }

  async onModuleDestroy() {
    const clientsMap: Map<any, MongoClient> = this.moduleRef.get<
      Map<any, MongoClient>
    >(getContainerToken(this.containerName));

    if (clientsMap) {
      await Promise.all(
        [...clientsMap.values()].map((connection) => connection.close()),
      );
    }
  }

  private static createAsyncProviders(
    options: MongoModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [
        {
          provide: getCurrentTenantToken(options.containerName),
          useFactory: async (optionsFactory: MongoOptionsFactory) => {
            const opts = await optionsFactory.createMongoOptions();
            return {
              tenantId: opts.tenantName,
            };
          },
          inject: [options.useExisting],
        },
        this.createAsyncOptionsProvider(options),
      ];
    } else if (options.useClass) {
      return [
        {
          provide: getCurrentTenantToken(options.containerName),
          useFactory: async (optionsFactory: MongoOptionsFactory) => {
            const opts = await optionsFactory.createMongoOptions();
            return {
              tenantId: opts.tenantName,
            };
          },
          inject: [options.useClass],
        },
        this.createAsyncOptionsProvider(options),
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    } else {
      return [
        {
          provide: getCurrentTenantToken(options.containerName),
          useValue: {
            tenantId: 'test',
          },
        },
      ];
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
