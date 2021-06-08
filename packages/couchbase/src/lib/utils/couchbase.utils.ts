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
 * File name:         couchbase.find-type.utils.ts
 * Last modified:     20/01/2021, 11:17
 ******************************************************************************/

import { DEFAULT_CLUSTER_CONNECTION } from '../couchbase.constants';
import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';
import { delay, retryWhen, scan } from 'rxjs/operators';

export function getModelToken(model: string) {
  return `${model}Model`;
}

export function getConnectionToken(name?: string) {
  return name && name !== DEFAULT_CLUSTER_CONNECTION
    ? `${name}Connection`
    : DEFAULT_CLUSTER_CONNECTION;
}

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000
): <T>(source: Observable<T>) => Observable<T> {
  const logger = new Logger('CouchbaseModule');
  return <T>(source: Observable<T>) =>
    source.pipe(
      retryWhen((e) =>
        e.pipe(
          scan((errorCount, error) => {
            logger.error(
              `Unable to connect to the database. Retrying (${
                errorCount + 1
              })...`,
              ''
            );
            if (errorCount + 1 >= retryAttempts) {
              throw error;
            }
            return errorCount + 1;
          }, 0),
          delay(retryDelay)
        )
      )
    );
}
