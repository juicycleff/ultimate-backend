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
 * File name:         consul.service.ts
 * Last modified:     21/01/2021, 00:54
 ******************************************************************************/

import * as ConsulStatic from 'consul';
import {
  handleRetry,
  IReactiveClient,
  LoggerUtil,
} from '@ultimate-backend/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConsulModuleOptions } from './consul-module.options';
import { CONSUL_CONFIG_OPTIONS } from './consul.constant';
import {
  Acl,
  Agent,
  Catalog,
  Event,
  Health,
  Kv,
  Lock,
  Session,
  Status,
  Watch,
} from 'consul';
import { defer } from 'rxjs';

@Injectable()
export class ConsulService
  implements
    IReactiveClient<ConsulStatic.Consul>,
    ConsulStatic.Consul,
    OnModuleInit {
  logger = new LoggerUtil('ConsulService');

  public consul: ConsulStatic.Consul;

  acl: Acl;
  agent: Agent;
  catalog: Catalog;
  event: Event;
  health: Health;
  kv: Kv;
  session: Session;
  status: Status;

  /**
   * Creates an instance of ConsulService.
   * @memberof ConsulService
   */
  constructor(
    @Inject(CONSUL_CONFIG_OPTIONS)
    public readonly options: ConsulModuleOptions
  ) {
    this.logger = new LoggerUtil('ConsulService', this.options.debug);
  }

  /**
   * Lock helper.
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async lock(opts: ConsulStatic.Lock.Options): Promise<Lock> {
    return (await this.consul).lock(opts);
  }

  /**
   * Watch helper.
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async watch(opts: ConsulStatic.Watch.Options): Promise<Watch> {
    return (await this.consul).watch(opts);
  }

  /**
   * Close consul connection
   */
  close(): any | Promise<void> {
    // super.status.;
  }

  private _initFields(client: ConsulStatic.Consul) {
    this.agent = client.agent;
    this.acl = client.acl;
    this.catalog = client.catalog;
    this.event = client.event;
    this.health = client.health;
    this.kv = client.kv;
    this.session = client.session;
    this.status = client.status;
  }

  async connect(): Promise<void> {
    try {
      await defer(async () => {
        this.logger.log('ConsulService client started');
        this.consul = await new ConsulStatic({
          ...this.options,
          promisify: true,
        });
        this.logger.log('ConsulService client connected successfully');
        this._initFields(this.consul);
      })
        .pipe(
          handleRetry(
            this.options.retryAttempts,
            this.options.retryDelays,
            'ConsulService'
          )
        )
        .toPromise();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }
}
