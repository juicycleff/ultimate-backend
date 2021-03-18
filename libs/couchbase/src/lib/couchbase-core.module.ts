/*******************************************************************************
 * Copyright (c) 2021. Rex Isaac Raphael
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * File name:         couchbase-core.module.ts
 * Last modified:     15/02/2021, 19:03
 ******************************************************************************/

import {
  DynamicModule,
  Global, Logger,
  Module,
  OnApplicationShutdown,
  Provider,
  Type
} from '@nestjs/common';
import {
    CouchbaseModuleAsyncOptions,
    CouchbaseModuleOptions,
    CouchbaseOptionsFactory,
} from './interfaces';
import {
    COUCHBASE_CONNECTION_NAME,
    COUCHBASE_MODULE_OPTIONS,
} from './couchbase.constants';
import { ModuleRef } from '@nestjs/core';
import { getConnectionToken, handleRetry } from './utils';
import * as ottoman from 'ottoman';
import 'couchbase';
import { defer } from 'rxjs';

@Global()
@Module({})
export class CouchbaseCoreModule implements OnApplicationShutdown {
    constructor(
        private readonly moduleRef: ModuleRef,
    ) {}

    static forRoot(options: CouchbaseModuleOptions): DynamicModule {
        const {
            clusterFactory,
            clusterName,
            url,
            scopeName,
            retryAttempts,
            retryDelays,
            ...others
        } = options;

        const couchbaseConnectionFactory =
            clusterFactory || ((cluster) => cluster);
        const couchbaseConnectionName = getConnectionToken(clusterName);

        const couchbaseConnectionNameProvider: Provider = {
            provide: COUCHBASE_CONNECTION_NAME,
            useValue: couchbaseConnectionName,
        };

        const connectionProvider: Provider = {
            provide: couchbaseConnectionName,
            useFactory: async () => {
                const conn = new ottoman.Ottoman();

                try {
                  await conn.connect({
                    bucketName: others.bucketName || 'default',
                    connectionString: url,
                    ...others,
                  });

                  return await defer(async () =>
                    couchbaseConnectionFactory(conn, couchbaseConnectionName),
                  )
                    .pipe(handleRetry(retryAttempts, retryDelays))
                    .toPromise();
                } catch (e) {
                  Logger.log(e, 'CouchbaseCoreModule');
                }
            },
        };

        return {
            module: CouchbaseCoreModule,
            providers: [connectionProvider, couchbaseConnectionNameProvider],
            exports: [connectionProvider],
        };
    }

    static forRootAsync(options: CouchbaseModuleAsyncOptions): DynamicModule {
        const couchbaseConnectionName = getConnectionToken(
            options.connectionName,
        );

        const couchbaseConnectionNameProvider: Provider = {
            provide: COUCHBASE_CONNECTION_NAME,
            useValue: couchbaseConnectionName,
        };

        const connectionProvider: Provider = {
            provide: COUCHBASE_CONNECTION_NAME,
            useFactory: async (
                couchbaseModuleOptions: CouchbaseModuleOptions,
            ) => {
                const {
                    clusterFactory,
                    clusterName,
                    url,
                    scopeName,
                    retryAttempts,
                    retryDelays,
                    ...others
                } = couchbaseModuleOptions;

                const couchbaseConnectionFactory =
                    clusterFactory || ((cluster) => cluster);

                const conn = new ottoman.Ottoman();
                await conn.connect({
                    bucketName: others.bucketName || 'default',
                    connectionString: url,
                    ...others,
                });

                return await defer(async () =>
                    couchbaseConnectionFactory(conn, couchbaseConnectionName),
                )
                    .pipe(handleRetry(retryAttempts, retryDelays))
                    .toPromise();
            },
            inject: [COUCHBASE_MODULE_OPTIONS],
        };

        const asyncProviders = this.createAsyncProviders(options);

        return {
            module: CouchbaseCoreModule,
            imports: options.imports,
            providers: [
                ...asyncProviders,
                connectionProvider,
                couchbaseConnectionNameProvider,
            ],
            exports: [connectionProvider],
        };
    }

    async onApplicationShutdown() {
        // const ottoman = this.moduleRef.get<Ottoman>(this.connectionName);
        // await ottoman.close();
    }

    private static createAsyncProviders(
        options: CouchbaseModuleAsyncOptions,
    ): Provider[] {
        if (options.useFactory || options.useExisting) {
            return [this.createAsyncOptionsProviders(options)];
        }

        const useClass = options.useExisting as Type<CouchbaseOptionsFactory>;

        return [
            {
                provide: useClass,
                useClass,
            },
        ];
    }

    private static createAsyncOptionsProviders(
        options: CouchbaseModuleAsyncOptions,
    ): Provider {
        if (options.useFactory) {
            return {
                useFactory: options.useFactory,
                inject: options.inject,
                provide: COUCHBASE_MODULE_OPTIONS,
            };
        }

        const inject = [
            (options.useClass || options.useExisting) as Type<
                CouchbaseOptionsFactory
            >,
        ];

        return {
            provide: COUCHBASE_MODULE_OPTIONS,
            useFactory: async (optionsFactory: CouchbaseOptionsFactory) =>
                await optionsFactory.createCouchbaseOptions(),
            inject,
        };
    }
}
