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
 * File name:         etcd.client.ts
 * Last modified:     07/02/2021, 12:15
 ******************************************************************************/

import {
  BeforeApplicationShutdown,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { handleRetry, IReactiveClient } from '@ultimate-backend/common';
import { Etcd3 } from 'etcd3';
import { EtcdConfig } from './etcd.config';
import { defer } from 'rxjs';

@Injectable()
export class EtcdClient
  implements IReactiveClient<Etcd3>, OnModuleInit, BeforeApplicationShutdown {
  private logger = new Logger(EtcdClient.name);
  client: Etcd3;

  constructor(private readonly opts: EtcdConfig) {}

  close(): any | Promise<void> {
    if (this.client) {
      this.client.close();
    }
  }

  async connect(): Promise<void> {
    try {
      return await defer(() => {
        this.logger.log('EtcdClient client started');
        console.log('EtcdClient connected', this.opts.config);
        this.client = new Etcd3(this.opts.config.etcdOptions);
        this.logger.log('EtcdClient client connected successfully');
      })
        .pipe(
          handleRetry(
            this.opts.config.retryAttempts,
            this.opts.config.retryDelays,
            EtcdClient.name
          )
        )
        .toPromise();
    } catch (e) {
      this.logger.error(e);
    }
  }

  beforeApplicationShutdown(signal?: string): any {
    this.close();
  }

  async onModuleInit() {
    await this.connect();
  }
}
