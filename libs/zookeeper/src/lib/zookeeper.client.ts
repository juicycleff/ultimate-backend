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
 * File name:         zookeeper.client.ts
 * Last modified:     08/02/2021, 11:17
 ******************************************************************************/
import {
  BeforeApplicationShutdown,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { defer } from 'rxjs';
import { merge } from 'lodash';
import { handleRetry, LoggerUtil } from '@ultimate-backend/common';
import { ZookeeperModuleOptions } from './zookeeper-module.options';
import { ZOOKEEPER_CONFIG_OPTIONS } from './zookeeper.constant';
import ZooKeeper from 'zookeeper';

@Injectable()
export class ZookeeperClient extends ZooKeeper implements BeforeApplicationShutdown, OnModuleInit {
  private opts = {};
  private logg = new LoggerUtil(ZookeeperClient.name);
  public connected = false;

  constructor(
    @Inject(ZOOKEEPER_CONFIG_OPTIONS)
    private readonly options: ZookeeperModuleOptions
  ) {
    super(merge( {
      debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
      host_order_deterministic: false,
    }, {
      connect: options.host,
      timeout: options.timeout,
      debug_level: options.logLevel,
      host_order_deterministic: false,
    }));

    this.opts = merge( {
      debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
      host_order_deterministic: false,
    }, {
      connect: options.host,
      timeout: options.timeout,
      debug_level: options.logLevel,
      host_order_deterministic: false,
    });

    this.logg = new LoggerUtil(ZookeeperClient.name, options.debug);
  }

  close(): any | Promise<void> {
    super.close();
  }

  async connect(): Promise<void> {
    try {
      await defer(async () => {
        this.on('connect', () => {
          this.connected = true;
          this.logg.log('Zookeeper client connected successfully');
        });
        super.connect(this.opts, () => {
          this.connected = true;
          // this.logg.log('Zookeeper client connected successfully');
        });
      })
        .pipe(
          handleRetry(
            this.options.retryAttempts,
            this.options.retryDelays,
            ZookeeperClient.name,
          )
        )
        .toPromise();
    } catch (e) {
      this.connected = false;
      this.logg.error(e);
    }
  }

  beforeApplicationShutdown(signal?: string): any {
    this.close();
  }

  async onModuleInit() {
    await this.connect();
  }
}
