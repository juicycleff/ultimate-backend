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
 * File name:         couchbase.module.ts
 * Last modified:     20/01/2021, 11:17
 ******************************************************************************/

import { DynamicModule, flatten, Module } from '@nestjs/common';
import {
  CouchbaseModuleAsyncOptions,
  CouchbaseModuleOptions,
  ModelDefinition,
} from './interfaces';
import { CouchbaseCoreModule } from './couchbase-core.module';
import { AsyncModelFactory } from './interfaces/async-model-factory.interface';
import {
  createCouchbaseAsyncProviders,
  createCouchbaseProviders,
} from './couchbase.provider';

@Module({
  imports: [CouchbaseCoreModule],
})
export class CouchbaseModule {
  static forRoot(options: CouchbaseModuleOptions): DynamicModule {
    return {
      module: CouchbaseCoreModule,
      imports: [CouchbaseCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: CouchbaseModuleAsyncOptions): DynamicModule {
    return {
      module: CouchbaseCoreModule,
      imports: [CouchbaseCoreModule.forRootAsync(options)],
    };
  }

  static forFeature(
    models: ModelDefinition[] = [],
    connectionName?: string
  ): DynamicModule {
    const providers = createCouchbaseProviders(connectionName, models);
    return {
      module: CouchbaseCoreModule,
      providers: providers,
      exports: providers,
    };
  }

  static forFeatureAsync(
    factories: AsyncModelFactory[] = [],
    connectionName?: string
  ): DynamicModule {
    const providers = createCouchbaseAsyncProviders(connectionName, factories);
    const imports = factories.map((factory) => factory.imports || []);
    const uniqImports = new Set(flatten(imports));

    return {
      module: CouchbaseCoreModule,
      imports: [...uniqImports],
      providers: providers,
      exports: providers,
    };
  }
}
