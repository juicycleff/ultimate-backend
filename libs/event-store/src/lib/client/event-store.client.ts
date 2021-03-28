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
 * File name:         event-store.client.ts
 * Last modified:     14/02/2021, 15:55
 ******************************************************************************/

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventStoreDBClient } from '@eventstore/db-client';
import { EventStoreClientOptions, IBrokerClient } from '../interface';
import { handleRetry, LoggerUtil } from '@ultimate-backend/common';
import { defer } from 'rxjs';
import { EventStoreConfig } from '../event-store.config';

/**
 * @description Event store setup from eventstore.org
 */
@Injectable()
export class EventStoreClient
  implements IBrokerClient<EventStoreDBClient>, OnModuleInit, OnModuleDestroy {
  _client: EventStoreDBClient;
  connected = false;

  private logger = new LoggerUtil(EventStoreClient.name);

  constructor(private readonly options: EventStoreConfig) {}

  async onModuleInit() {
    this.logger = new LoggerUtil(
      EventStoreClient.name,
      this.options.config?.debug
    );

    await this.connect();
  }

  public client(): EventStoreDBClient {
    return this._client;
  }

  public close(): void {
    // throw new Error('Not implemented');
  }

  async connect(): Promise<void> {
    try {
      await defer(async () => {
        this.logger.log('EventStoreClient client is connecting');
        const broker = this.options.config?.broker as EventStoreClientOptions;
        this._client = new EventStoreDBClient(
          broker.connectionSettings as any,
          broker.channelCredentials,
          broker.defaultUserCredentials
        );
        this.connected = true;
        this.logger.log('EventStoreClient client connected successfully');
      })
        .pipe(
          handleRetry(
            this.options.config?.retryAttempts,
            this.options.config?.retryDelays,
            EventStoreClient.name
          )
        )
        .toPromise();
    } catch (e) {
      this.connected = false;
      throw new Error(e);
    }
  }

  onModuleDestroy(): any {
    this.close();
  }
}
