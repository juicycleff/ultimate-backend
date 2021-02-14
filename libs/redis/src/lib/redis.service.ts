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
 * File name:         redis.service.ts
 * Last modified:     08/02/2021, 11:17
 ******************************************************************************/

import { BeforeApplicationShutdown, Inject, Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import {
  Deferred,
  IReactiveClient,
  handleRetry,
} from '@ultimate-backend/common';
import { defer } from 'rxjs';
import { RedisModuleOptions } from './redis-module.options';
import { REDIS_CONFIG_OPTIONS } from './redis.constant';

@Injectable()
export class RedisService
  extends Redis
  implements IReactiveClient<Redis>, BeforeApplicationShutdown {
  client: Promise<Redis>;
  deferredClient: Deferred<Redis>;

  constructor(
    @Inject(REDIS_CONFIG_OPTIONS) private readonly options: RedisModuleOptions
  ) {
    super(options.redisOptions);
  }

  close(): any | Promise<void> {
    super.disconnect();
  }

  async connect(): Promise<void> {
    await defer(async () => super.connect())
      .pipe(
        handleRetry(
          this.options.retryAttempts,
          this.options.retryDelays,
          'RedisService'
        )
      )
      .toPromise();
  }

  beforeApplicationShutdown(signal?: string): any {
    this.close();
  }
}
