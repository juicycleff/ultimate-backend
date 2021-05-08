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
 * File name:         stan.client.ts
 * Last modified:     14/02/2021, 16:40
 ******************************************************************************/

import { GooglePubsubClientOptions, IBrokerClient } from '../interface';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { handleRetry, LoggerUtil } from '@ultimate-backend/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { defer } from 'rxjs';
import { PubSub } from '../external/gpubsub.types';
import { EventStoreConfig } from '../event-store.config';
import { EventEmitter } from 'events';

let googlePubsubPackage: any = {};

@Injectable()
export class GooglePubsubClient
  extends EventEmitter
  implements IBrokerClient<PubSub>, OnModuleInit, OnModuleDestroy {
  _client: PubSub;
  connected = false;

  private logger = new LoggerUtil(this.constructor.name);

  constructor(private readonly options: EventStoreConfig) {
    super();
    googlePubsubPackage = loadPackage(
      '@google-cloud/pubsub',
      GooglePubsubClient.name,
      () => require('@google-cloud/pubsub')
    );
  }

  public client(): PubSub {
    return this._client;
  }

  public async close(): Promise<void> {
    await this._client.close();
  }

  async connect(): Promise<void> {
    try {
      await defer(async () => {
        this.logger.log('GooglePubsubClient client is connecting');
        const broker = this.options.config?.broker as GooglePubsubClientOptions;
        this._client = new googlePubsubPackage.PubSub(broker.options);
        this.connected = true;
        this.emit('connected');
        this.logger.log('GooglePubsubClient client connected successfully');
      })
        .pipe(
          handleRetry(
            this.options.config?.retryAttempts,
            this.options.config?.retryDelays,
            GooglePubsubClient.name
          )
        )
        .toPromise();
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }

  async onModuleDestroy() {
    await this.close();
  }

  async onModuleInit() {
    this.logger = new LoggerUtil(
      this.constructor.name,
      this.options.config?.debug
    );
    await this.connect();
  }
}
