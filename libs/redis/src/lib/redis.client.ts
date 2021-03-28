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
 * File name:         redis.client.ts
 * Last modified:     08/02/2021, 11:17
 ******************************************************************************/

import {
  BeforeApplicationShutdown,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import * as Redis from 'ioredis';
import { IReactiveClient, handleRetry } from '@ultimate-backend/common';
import { defer } from 'rxjs';
import { RedisConfig } from './redis.config';

@Injectable()
export class RedisClient
  implements IReactiveClient<Redis>, BeforeApplicationShutdown, OnModuleInit {
  client: Redis;
  logg = new Logger(RedisClient.name);

  constructor(private readonly options: RedisConfig) {}

  async onModuleInit() {
    await this.connect();
  }

  close(): any | Promise<void> {
    if (this.client) {
      this.client.disconnect();
    }
  }

  async connect(): Promise<void> {
    await defer(async () => {
      this.logg.log('Redis client is connecting');
      this.client = new Redis(this.options.config.redisOptions);
      this.logg.log('Redis client connected successfully');
    })
      .pipe(
        handleRetry(
          this.options.config.retryAttempts,
          this.options.config.retryDelays,
          'RedisService'
        )
      )
      .toPromise();
  }

  beforeApplicationShutdown(signal?: string): any {
    this.close();
  }
}
