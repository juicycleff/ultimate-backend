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

import { CQRSEvent, EventStoreModuleOptions, IBrokerClient, StanClientOptions } from '../interface';
import { Stan, connect as stanConnect } from 'node-nats-streaming';
import * as uuid from 'uuid';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ProvidersConstants } from '../event-store.constant';
import { LoggerUtil } from '@ultimate-backend/common';

@Injectable()
export class StanClient implements IBrokerClient<Stan>, OnModuleInit, OnModuleDestroy {
  _client: Stan;
  connected: boolean;

  private logger = new LoggerUtil(this.constructor.name);

  constructor(
    @Inject(ProvidersConstants.EVENT_STORE_CONFIG)
    private readonly options: EventStoreModuleOptions
  ) {
    this.logger = new LoggerUtil(this.constructor.name, options.debug);
  }

  public client(): Stan {
    return this._client;
  }

  public close(): void {
    this._client.close();
  }

  connect(): void {
    try {
      const broker = this.options.broker as StanClientOptions;
      let clientId = uuid.v4();
      if (clientId) {
        clientId = broker.clientId;
      }

      this._client = stanConnect(broker.clusterId, clientId, broker.options);

      this._client.on('connect', () => {
        this.connected = true;
        this.logger.log('STAN Event Store client connected!');
      });
      this._client.on('disconnect:', () => {
        this.connected = false;
        this.logger.error('STAN Event Store client disconnected!');
        this.connect();
      });
      this._client.on('close:', () => {
        this.connected = false;
        this.logger.error('STAN Event Store client closed!');
        this.connect();
      });
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }

  newEvent(name, payload: Record<string, any>): CQRSEvent {
    return this.newEventBuilder(name, payload);
  }

  private newEventBuilder(eventType: string, data: any, metadata?: any, eventId?: string): CQRSEvent {
    const event: CQRSEvent = {
      eventId: eventId || uuid.v4(),
      eventType,
      data
    };

    if (metadata !== undefined) {
      event.metadata = metadata;
    }
    return event;
  }

  onModuleDestroy(): any {
    this.close();
  }

  onModuleInit(): any {
    this.connect();
  }
}
