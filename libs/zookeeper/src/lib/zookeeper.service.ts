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
 * File name:         zookeeper.service.ts
 * Last modified:     08/02/2021, 11:17
 ******************************************************************************/

import {
  BeforeApplicationShutdown,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { defer } from 'rxjs';
import { handleRetry, LoggerUtil } from '@ultimate-backend/common';
import { ZookeeperModuleOptions } from './zookeeper-module.options';
import { ZOOKEEPER_CONFIG_OPTIONS } from './zookeeper.constant';
import ZooKeeper = require('zookeeper');

@Injectable()
export class ZookeeperService
  extends ZooKeeper
  implements BeforeApplicationShutdown, OnModuleInit {
  config = {};
  logger = new LoggerUtil('ZookeeperService');

  constructor(
    @Inject(ZOOKEEPER_CONFIG_OPTIONS)
    private readonly options: ZookeeperModuleOptions
  ) {
    super({
      connect: options.host,
      timeout: options.timeout,
      debug_level: options.logLevel,
      host_order_deterministic: false,
    });

    this.config = {
      connect: options.host,
      timeout: options.timeout,
      debug_level: options.logLevel,
      host_order_deterministic: false,
    };

    this.logger = new LoggerUtil('ZookeeperService', options.debug);
  }

  close(): any | Promise<void> {
    super.removeAllListeners();
    super.close();
  }

  async connect(): Promise<void> {
    await defer(async () => {
      this.on('connect', () => {
        this.logger.log('Zookeeper client connected successfully');
      });
      super.init(this.config);
    })
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

  async onModuleInit() {
    await this.connect();
  }
}
