import { ModuleRef } from '@nestjs/core';
import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import * as hash from 'object-hash';

import { getCurrentTenantToken } from '../../utils';
import {
  getArangoClientToken,
  getArangoContainerToken,
  getArangoDbToken,
} from './database.util';
import {
  ARANGO_DEFAULT_DATABASE_CONTAINER_NAME,
  ARANGO_DATABASE_CONTAINER_NAME,
} from '../../constants';
import {
  ArangoModuleAsyncOptions,
  ArangoModuleOptions,
  ArangoOptionsFactory,
} from './interfaces/arango-options.interface';
import {
  ARANGO_MODULE_OPTIONS,
  DEFAULT_ARANGO_DATABASE_OPTIONS,
} from './arango.constants';
import { ArangoClientOption } from './interfaces';
import { Database } from 'arangojs';
import { ArangoDatabaseClient } from './arango.client';

@Global()
@Module({})
export class ArangoCoreModule implements OnModuleDestroy {
  private databaseClient: ArangoDatabaseClient;
  constructor(
    @Inject(ARANGO_DATABASE_CONTAINER_NAME)
    private readonly containerName: string,
    private readonly moduleRef: ModuleRef,
  ) {
    this.databaseClient = new ArangoDatabaseClient();
  }

  static forRoot(
    uri: string | string[],
    dbName: string,
    clientOptions: ArangoClientOption = DEFAULT_ARANGO_DATABASE_OPTIONS,
    containerName: string = ARANGO_DEFAULT_DATABASE_CONTAINER_NAME,
  ): DynamicModule {
    const containerNameProvider = {
      provide: ARANGO_DATABASE_CONTAINER_NAME,
      useValue: containerName,
    };

    const connectionContainerProvider = {
      provide: getArangoContainerToken(containerName),
      useFactory: () => new Map<any, Database>(),
    };

    const dbProvider = {
      provide: getArangoDbToken(containerName),
      useFactory: async (connections: Map<any, Database>) => {
        const key = hash.sha1({
          uri,
          clientOptions,
        });
        if (connections.has(key)) {
          return connections.get(key);
        }

        const connection = new ArangoDatabaseClient();
        const client = await connection.connect(dbName, clientOptions);
        connections.set(key, client);
        return client;
      },
      inject: [getArangoContainerToken(containerName)],
    };

    const currentTenantProvider = {
      provide: getCurrentTenantToken(containerName),
      useValue: {
        tenantId: null,
      },
      inject: [getArangoClientToken(containerName)],
    };

    return {
      module: ArangoCoreModule,
      providers: [
        containerNameProvider,
        connectionContainerProvider,
        dbProvider,
        currentTenantProvider,
      ],
      exports: [dbProvider, currentTenantProvider],
    };
  }

  static forRootAsync(options: ArangoModuleAsyncOptions): DynamicModule {
    const mongoContainerName =
      options.containerName || ARANGO_DEFAULT_DATABASE_CONTAINER_NAME;

    const containerNameProvider = {
      provide: ARANGO_DATABASE_CONTAINER_NAME,
      useValue: mongoContainerName,
    };

    const connectionContainerProvider = {
      provide: getArangoContainerToken(mongoContainerName),
      useFactory: () => new Map<any, Database>(),
    };

    const dbProvider = {
      provide: getArangoDbToken(mongoContainerName),
      useFactory: async (
        connections: Map<any, Database>,
        mongoModuleOptions: ArangoModuleOptions,
      ) => {
        const { uri, clientOptions } = mongoModuleOptions;
        const key = hash.sha1({
          uri,
          clientOptions,
        });
        if (connections.has(key)) {
          return connections.get(key);
        }

        const connection = new ArangoDatabaseClient();
        const client = await connection.connect(
          mongoModuleOptions.dbName,
          clientOptions,
        );
        connections.set(key, client);
        return client;
      },
      inject: [
        getArangoContainerToken(mongoContainerName),
        ARANGO_MODULE_OPTIONS,
      ],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: ArangoCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        dbProvider,
        containerNameProvider,
        connectionContainerProvider,
      ],
      exports: [...asyncProviders, dbProvider],
    };
  }

  async onModuleDestroy() {
    const clientsMap: Map<any, Database> = this.moduleRef.get<
      Map<any, Database>
    >(getArangoContainerToken(this.containerName));

    if (clientsMap) {
      await Promise.all(
        [...clientsMap.values()].map((connection) => connection.close()),
      );
    }
  }

  private static createAsyncProviders(
    options: ArangoModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [
        {
          provide: getCurrentTenantToken(options.containerName),
          useFactory: async (optionsFactory: ArangoOptionsFactory) => {
            const opts = await optionsFactory.createArangoOptions();
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
          useFactory: async (optionsFactory: ArangoOptionsFactory) => {
            const opts = await optionsFactory.createArangoOptions();
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
    options: ArangoModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: ARANGO_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    } else if (options.useExisting) {
      return {
        provide: ARANGO_MODULE_OPTIONS,
        useFactory: async (optionsFactory: ArangoOptionsFactory) =>
          await optionsFactory.createArangoOptions(),
        inject: [options.useExisting],
      };
    } else if (options.useClass) {
      return {
        provide: ARANGO_MODULE_OPTIONS,
        useFactory: async (optionsFactory: ArangoOptionsFactory) =>
          await optionsFactory.createArangoOptions(),
        inject: [options.useClass],
      };
    } else {
      throw new Error('Invalid ArangoModule options');
    }
  }
}
