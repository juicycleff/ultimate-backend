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
 * File name:         mdns-service-registry.ts
 * Last modified:     11/02/2021, 00:22
 ******************************************************************************/

import { LocalRegistryProviderOptions } from '../../index';
import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MdnsRegistration } from './mdns-registration';
import { MdnsRegistrationBuilder } from './mdns-registration.builder';
import { Bonjour, Browser } from 'bonjour';
import * as bonjour from 'bonjour';
import { SERVICE_REGISTRY_CONFIG, ServiceRegistry } from '@ultimate-backend/common';

export class MdnsServiceRegistry
  implements ServiceRegistry<MdnsRegistration>, OnModuleInit, OnModuleDestroy {
  logger = new Logger('MdnsServiceRegistry');

  registration: MdnsRegistration;
  bon: Bonjour = bonjour();
  browser: Browser;

  constructor(
    @Inject(SERVICE_REGISTRY_CONFIG)
    private readonly options: LocalRegistryProviderOptions
  ) {
    this.init();
  }

  async init() {
    if (this.options.heartbeat == null)
      throw Error('HeartbeatOptions is required');

    if (this.options.service == null)
      throw Error('Service options is required.');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.registration = new MdnsRegistrationBuilder()
      .discoveryOptions(this.options.discovery)
      .heartbeatOptions(this.options.heartbeat)
      .host(this.options.service?.address)
      .port(this.options.service?.port)
      .domain(this.options.service?.domain)
      .serviceName(this.options.service?.name)
      .instanceId(this.options.service?.id)
      .build();

    this.browser = await this.bon.find(
      {
        type: 'http',
        txt: {
          domain: this.options.service.domain,
        },
      },
      (service) => {
        // console.log('service operational: ', service);
      }
    );

    this.listenForServices();
  }

  async close(): Promise<void> {
    await this.bon.destroy();

    if (this.browser) {
      await this.browser.stop();
      await this.browser.removeAllListeners();
    }
  }

  listenForServices(): void {
    try {
      this.browser.on('up', (service) => {
        if (
          service.txt.domain &&
          service.txt.domain === this.options.service.domain &&
          service.txt.serviceid !== this.options.service.id
        ) {
          console.log('service up: ', service);
        }
      });
      this.browser.on('down', (service) => {
        if (
          service.txt.domain &&
          service.txt.domain === this.options.service.domain &&
          service.txt.serviceid !== this.options.service.id
        ) {
          console.log('service down: ', service);
        }
      });

      this.browser.start();
    } catch (err) {
      this.logger.error(err);
    }
  }

  async deregister(): Promise<void> {
    this.logger.log(
      `Deregistering service with mdns: ${this.registration.getInstanceId()}`
    );

    this.bon.destroy();
  }

  async register(): Promise<void> {
    try {
      this.logger.log(
        `registering service with id: ${this.registration.getInstanceId()}`
      );

      const options = this.registration.getService();

      await this.bon.publish({
        host: options.host,
        name: options.name,
        port: options.port,
        txt: {
          domain: options.txtRecord.domain,
          serviceid: options.txtRecord.serviceId,
        },
        probe: true,
        type: 'http',
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  getStatus<T>(registration: MdnsRegistration): Promise<T> {
    return Promise.resolve(undefined);
  }

  async onModuleDestroy() {
    await this.deregister();
    await this.close();
  }

  async onModuleInit() {
    await this.init();
    await this.register();
  }

  setStatus(registration: MdnsRegistration, status: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}
