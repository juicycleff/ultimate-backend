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

import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventStoreDBClient } from '@eventstore/db-client';
import * as uuid from 'uuid';
import {
  CQRSEvent,
  EventStoreClientOptions,
  EventStoreModuleOptions,
  IBrokerClient,
} from '../interface';
import { ProvidersConstants } from '../event-store.constant';
import { LoggerUtil } from '@ultimate-backend/common';

/**
 * @description Event store setup from eventstore.org
 */
@Injectable()
export class EventStoreClient implements IBrokerClient<EventStoreDBClient>, OnModuleInit, OnModuleDestroy {
  _client: EventStoreDBClient;
  connected: boolean;

  private logger = new LoggerUtil('EventStoreClient');

  constructor(
    @Inject(ProvidersConstants.EVENT_STORE_CONFIG)
    private readonly options: EventStoreModuleOptions
  ) {
    this.logger = new LoggerUtil(this.constructor.name, options.debug);
  }

  onModuleInit() {
     this.connect();
  }

  public client(): EventStoreDBClient {
    return this._client;
  }

  public close(): void {
    // throw new Error('Not implemented');
  }

  connect(): void {
    try {
      const broker = this.options.broker as EventStoreClientOptions;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._client = new EventStoreDBClient(broker.connectionSettings, broker.connectionSettings, broker.defaultUserCredentials);
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
}
