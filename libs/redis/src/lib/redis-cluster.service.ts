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
 * File name:         redis-cluster.service.ts
 * Last modified:     08/02/2021, 11:17
 ******************************************************************************/

import {
  BeforeApplicationShutdown,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Cluster } from 'ioredis';
import {
  Deferred,
  IReactiveClient,
  handleRetry,
  LoggerUtil,
} from '@ultimate-backend/common';
import { defer } from 'rxjs';
import { RedisModuleOptions } from './redis-module.options';
import { REDIS_CONFIG_OPTIONS } from './redis.constant';

@Injectable()
export class RedisClusterService
  extends Cluster
  implements IReactiveClient<Cluster>, BeforeApplicationShutdown, OnModuleInit {
  client: Promise<Cluster>;
  deferredClient: Deferred<Cluster>;
  logger = new LoggerUtil(RedisClusterService.name);

  constructor(
    @Inject(REDIS_CONFIG_OPTIONS) private readonly options: RedisModuleOptions
  ) {
    super(options.nodes, options.redisOptions);
    this.logger = new LoggerUtil(RedisClusterService.name, options.debug);
  }

  /**
   * @description close any open client connections
   */
  close(): void {
    super.disconnect();
  }

  /**
   * @description connect the client with retry mechanism
   */
  async connect(): Promise<void> {
    return await defer(async () => super.connect())
      .pipe(
        handleRetry(
          this.options.retryAttempts,
          this.options.retryDelays,
          'RedisClusterService'
        )
      )
      .toPromise();
  }

  beforeApplicationShutdown(signal?: string): any {
    this.close();
  }

  onModuleInit(): any {
    try {
      this.connect();
    } catch (err) {
      this.logger.error(err);
    }
  }
}
