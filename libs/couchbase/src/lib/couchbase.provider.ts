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
 * File name:         couchbase.provider.ts
 * Last modified:     15/02/2021, 19:04
 ******************************************************************************/

import { ModelDefinition } from './interfaces';
import { Logger, Provider } from '@nestjs/common';
import { getConnectionToken, getModelToken } from './utils';
import { Ottoman } from 'ottoman';
import { AsyncModelFactory } from './interfaces/async-model-factory.interface';

export function createCouchbaseProviders(
  connectionName: string,
  options: ModelDefinition[] = []
): Provider[] {
  return options.reduce(
    (providers, option) => [
      ...providers,
      ...createCouchbaseProviders(connectionName),
      {
        provide: getModelToken(option.name),
        useFactory: (ottoman: Ottoman) => {
          const model = ottoman.model(
            option.name,
            option.schema,
            option.option
          );

          try {
            ottoman.start();
          } catch (e) {
            Logger.error(e, 'createCouchbaseProviders');
          }
          return model;
        },
        inject: [getConnectionToken(connectionName)],
      },
    ],
    [] as Provider[]
  );
}

export function createCouchbaseAsyncProviders(
  connectionName: string,
  modelFactories: AsyncModelFactory[] = []
): Provider[] {
  return modelFactories.reduce(
    (providers, option) => [
      ...providers,
      {
        provide: getModelToken(option.name),
        useFactory: async (ottoman: Ottoman, ...args: any[]) => {
          const schema = await option.useFactory(args);

          const model = ottoman.model(option.name, schema, option.option);
          return model;
        },
        inject: [getConnectionToken(connectionName), ...(option.inject || [])],
      },
    ],
    [] as Provider[]
  );
}
