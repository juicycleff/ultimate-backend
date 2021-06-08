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
import { Bonjour, Browser, RemoteService, Service } from 'bonjour';
import * as bonjour from 'bonjour';
import {
  Registration,
  SERVICE_REGISTRY_CONFIG,
  ServiceRegistry,
  ServiceStore,
} from '@ultimate-backend/common';
import { mdnsToServiceInstance } from './mdns-service.utils';

export class MdnsServiceRegistry
  implements ServiceRegistry<MdnsRegistration>, OnModuleInit, OnModuleDestroy {
  logger = new Logger(MdnsServiceRegistry.name);

  registration: Registration<Service>;
  bon: Bonjour = bonjour();
  browser: Browser;
  activeService: Service;

  constructor(
    @Inject(SERVICE_REGISTRY_CONFIG)
    private readonly options: LocalRegistryProviderOptions,
    private readonly serviceStore: ServiceStore
  ) {
    this.init();
  }

  async init() {
    if (!this.options.heartbeat) throw Error('HeartbeatOptions is required');

    if (!this.options.service) throw Error('Service options is required.');

    this.registration = new MdnsRegistrationBuilder()
      .discoveryOptions(this.options.discovery)
      .heartbeatOptions(this.options.heartbeat)
      .host(this.options.service?.address)
      .port(this.options.service?.port)
      .metadata(this.options.service?.metadata)
      .tags(this.options.service?.tags)
      .status(this.options.service?.status)
      .version(this.options.service?.version)
      .domain(this.options.service?.domain)
      .serviceName(this.options.service?.name)
      .instanceId(this.options.service?.id)
      .build();

    this.browser = this.bon.find(
      {
        type: 'http',
        txt: {
          domain: this.options.service.domain,
        },
      },
      (service) => {
        if (
          service.txt.domain &&
          service.txt.domain === this.options.service.domain
        ) {
          this.addToStore(service);
        }
      }
    );

    this.listenForServices();
  }

  private addToStore(service: RemoteService) {
    const instance = mdnsToServiceInstance(service);
    this.serviceStore.setServices(service.name, [instance]);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.stop();
    }
  }

  listenForServices(): void {
    try {
      this.browser.on('down', (service) => {
        this.serviceStore.removeService(service.name);
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

    if (this.activeService) {
      await this.activeService.stop();
    }
    this.browser.update();
    this.close();

    this.activeService = null;
  }

  async register(): Promise<void> {
    try {
      this.logger.log(
        `registering service with id: ${this.registration.getInstanceId()}`
      );

      const options = this.registration.getService();

      this.activeService = await this.bon.publish({
        host: options.host,
        name: options.name,
        port: options.port,
        txt: options.txt,
        probe: true,
        type: 'http',
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  getStatus<T>(): Promise<T> {
    return Promise.resolve(undefined);
  }

  async onModuleDestroy() {
    await this.deregister();
  }

  async onModuleInit() {
    await this.init();
    await this.register();
  }

  setStatus(_status: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}
