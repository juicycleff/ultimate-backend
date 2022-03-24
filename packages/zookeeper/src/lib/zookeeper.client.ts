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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as ZooKeeper from 'zookeeper';
import {
  BeforeApplicationShutdown,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { defer, EMPTY } from 'rxjs';
import { merge } from 'lodash';
import { handleRetry } from '@ultimate-backend/common';
import { ZookeeperConfig } from './zookeeper.config';

@Injectable()
export class ZookeeperClient
  extends ZooKeeper
  implements BeforeApplicationShutdown, OnModuleInit {
  private opts = {};
  private logg = new Logger(ZookeeperClient.name);
  public connected = false;

  constructor(private readonly options: ZookeeperConfig) {
    super({
      debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
      host_order_deterministic: false,
    });

    this.opts = {
      debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
      host_order_deterministic: false,
    };
  }

  close(): any | Promise<void> {
    super.close();
  }

  async connect(): Promise<void> {
    this.opts = merge({}, this.opts, {
      connect: this.options.config.host,
      timeout: this.options.config.timeout,
      debug_level: this.options.config.logLevel,
      host_order_deterministic: false,
    });

    try {
      await defer(async () => {
        this.once('connect', () => {
          this.connected = true;
          this.logg.log('Zookeeper client connected successfully');
        });
        super.connect(this.opts, () => {
          this.connected = true;
        });
        return EMPTY;
      })
        .pipe(
          handleRetry(
            this.options.config.retryAttempts,
            this.options.config.retryDelays,
            ZookeeperClient.name
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