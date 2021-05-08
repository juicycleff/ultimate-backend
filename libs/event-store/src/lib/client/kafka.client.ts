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
 * File name:         kafka.client.ts
 * Last modified:     07/05/2021, 23:09
 ******************************************************************************/
import { handleRetry, LoggerUtil } from '@ultimate-backend/common';
import { EventStoreConfig } from '../event-store.config';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { defer } from 'rxjs';
import * as uuid from 'uuid';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter } from 'events';
import { IBrokerClient } from '@ultimate-backend';
import { KafkaClientOptions } from '../interface/kafka-client.options';
import { Kafka, Producer, Consumer } from '../external/kafka.types';

let kafkaPackage: any = {};

@Injectable()
export class KafkaClient
  extends EventEmitter
  implements IBrokerClient<Kafka>, OnModuleInit, OnModuleDestroy {

  connected = false;
  private _client: Kafka;
  private _producer: Producer;
  private _consumer: Consumer;


  private logger = new LoggerUtil(this.constructor.name);

  constructor(private readonly options: EventStoreConfig) {
    super();
    kafkaPackage = loadPackage('kafkajs', KafkaClient.name, () =>
      require('kafkajs')
    );
  }

  client(): Kafka {
    return this._client;
  }

  get producer(): Producer {
    return this._producer;
  }

  get consumer(): Consumer {
    return this._consumer;
  }

  async close() {
    if (this._consumer) {
      await this._consumer.disconnect();
    }
    if (this._producer) {
      await this._producer.disconnect();
    }
  }

  async connect(): Promise<void> {
    try {
      await defer(async () => {
        const broker = this.options.config?.broker as KafkaClientOptions;
        let clientId = uuid.v4();
        if (broker.options.clientId) {
          clientId = broker.options.clientId;
        }

        this._client = new kafkaPackage.Kafka({
          ...broker.options,
          clientId
        });

        this._producer = this._client.producer(broker.producerOptions);
        this._consumer = this._client.consumer({ ...broker.consumerOptions, groupId: broker.groupId });

        await Promise.all([this._producer.connect(), this._consumer.connect()]);

        // producer events
        this._producer.on('producer.connect', () => {
          this.connected = true;
          this.logger.log('Kafka Event Store producer connected!');
          this.emit('connected');
        });
        this._producer.on('producer.disconnect', () => {
          this.connected = false;
          this.emit('disconnected');
          this.logger.error('Kafka Event Store producer disconnected!');
          throw new Error('Kafka event store producer disconnected!');
        });
        this._producer.on('producer.network.request_timeout', () => {
          this.logger.warn('Kafka event store producer request timeout!');
        });
        this._producer.on('producer.network.request_queue_size', () => {
          this.logger.warn('Kafka event store producer request queue size error!');
        });

        // consumer events
        this._consumer.on('consumer.connect', () => {
          this.connected = true;
          this.logger.log('Kafka event store consumer connected!');
          this.emit('connected');
        });
        this._consumer.on('consumer.disconnect', () => {
          this.connected = false;
          this.emit('disconnected');
          this.logger.error('Kafka Event Store consumer disconnected!');
          throw new Error('Kafka event store consumer disconnected!');
        });
        this._consumer.on('consumer.network.request_timeout', () => {
          this.logger.warn('Kafka event store consumer request timeout!');
        });
        this._consumer.on('consumer.crash', () => {
          this.connected = false;
          this.emit('disconnected');
          this.logger.error('Kafka event store consumer crashed!');
          throw new Error('Kafka event store consumer crashed!');
        });
        this._consumer.on('consumer.network.request_queue_size', () => {
          this.logger.warn('Kafka event store consumer request queue size error!');
        });
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
