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

import { IBrokerClient, StanClientOptions } from '../interface';
import * as uuid from 'uuid';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { handleRetry, LoggerUtil } from '@ultimate-backend/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { Stan } from '../external/stan.types';
import { defer, EMPTY } from 'rxjs';
import { EventStoreConfig } from '../event-store.config';
import { EventEmitter } from 'events';

let stanPackage: any = {};

@Injectable()
export class StanClient
  extends EventEmitter
  implements IBrokerClient<Stan>, OnModuleInit, OnModuleDestroy {
  _client: Stan;
  connected = false;

  private logger = new LoggerUtil(this.constructor.name);

  constructor(private readonly options: EventStoreConfig) {
    super();
    stanPackage = loadPackage('node-nats-streaming', StanClient.name, () =>
      require('node-nats-streaming')
    );
  }

  public client(): Stan {
    return this._client;
  }

  public close(): void {
    this._client.close();
  }

  async connect(): Promise<void> {
    try {
      await defer(async () => {
        const broker = this.options.config?.broker as StanClientOptions;
        let clientId = uuid.v4();
        if (broker.clientId) {
          clientId = broker.clientId;
        }

        this._client = stanPackage.connect(
          broker.clusterId,
          clientId,
          broker.options
        );

        this._client.on('connect', () => {
          this.connected = true;
          this.logger.log('Stan Event Store client connected!');
          this.emit('connected');
        });
        this._client.on('disconnect:', () => {
          this.connected = false;
          this.logger.error('Stan Event Store client disconnected!');
          throw new Error('Stan Event Store client disconnected!');
        });
        this._client.on('close:', () => {
          this.connected = false;
          this.logger.error('Stan Event Store client closed!');
          throw new Error('Stan Event Store client closed!');
        });
        return EMPTY;
      })
        .pipe(
          handleRetry(
            this.options.config?.retryAttempts,
            this.options.config?.retryDelays,
            'StanClient'
          )
        )
        .toPromise();
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }

  onModuleDestroy(): any {
    this.close();
  }

  async onModuleInit() {
    this.logger = new LoggerUtil(
      this.constructor.name,
      this.options.config?.debug
    );
    await this.connect();
  }
}
