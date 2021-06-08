/* eslint-disable no-prototype-builtins */
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
 * File name:         etcd-service-registry.ts
 * Last modified:     15/03/2021, 15:36
 ******************************************************************************/
import {
  Registration,
  Service,
  SERVICE_REGISTRY_CONFIG,
  ServiceInstance,
  ServiceRegistry,
  ServiceStore,
  serviceToInstance,
  sleep,
  TtlScheduler,
} from '@ultimate-backend/common';
import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as _ from 'lodash';
import { EtcdRegistration } from './etcd-registration';
import { EtcdClient } from '../etcd.client';
import { Watcher } from 'etcd3';
import { EtcdRegistryOptions } from './etcd-registry.options';
import { EtcdRegistrationBuilder } from './etcd-registration.builder';
import { IWatchResponse } from '../etcd.types';
import { isPlainObject } from '@nestjs/common/utils/shared.utils';
import { EtcdHeartbeatTask } from '../discovery';

export class EtcdServiceRegistry
  implements ServiceRegistry<EtcdRegistration>, OnModuleInit, OnModuleDestroy {
  // ub-service/service__${serviceName}__${ip}__${port}__<version (optional)>
  private readonly namespace = 'ub-service/';

  watcher: Watcher;
  registration: Registration<Service>;
  ttlScheduler?: TtlScheduler;
  logger = new Logger(EtcdServiceRegistry.name);
  private watchers: Map<string, Watcher> = new Map();

  constructor(
    private readonly etcd: EtcdClient,
    @Inject(SERVICE_REGISTRY_CONFIG)
    private readonly options: EtcdRegistryOptions,
    private readonly serviceStore: ServiceStore
  ) {}

  async init() {
    if (this.options.heartbeat == null)
      throw Error('HeartbeatOptions is required');

    if (this.options.discovery == null)
      throw Error('EtcdDiscoveryOptions is required.');

    this.registration = new EtcdRegistrationBuilder()
      .discoveryOptions(this.options.discovery)
      .heartbeatOptions(this.options.heartbeat)
      .host(this.options.service?.address)
      .port(this.options.service?.port)
      .tags(this.options.service?.tags)
      .status(this.options.service?.status)
      .version(this.options.service?.version)
      .metadata(this.options.service?.metadata)
      .serviceName(this.options.service?.name)
      .instanceId(this.options.service?.id)
      .build();

    if (this.options.heartbeat.enabled) {
      const task = new EtcdHeartbeatTask(
        this.etcd.client,
        this.registration.getInstanceId()
      );
      this.ttlScheduler = new TtlScheduler(this.options.heartbeat, task);
    }

    // watch for service change
    await this.watchAll();
  }

  close(): void {
    // todo
  }

  getStatus<T>(): Promise<T> {
    return Promise.resolve(undefined);
  }

  async onModuleInit() {
    try {
      await this.init();
      await this.register();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async onModuleDestroy() {
    await this.deregister();
  }

  private generateService() {
    return {
      ...this.options.service,
      ...this.registration.getService(),
    };
  }

  async deregister(): Promise<void> {
    this.logger.log(
      `Deregistering service with etcd: ${this.registration.getInstanceId()}`
    );

    try {
      this.ttlScheduler?.remove(this.registration.getInstanceId());

      await this.etcd.client
        .namespace(this.namespace)
        .delete()
        .key(this.registration.getInstanceId());
      this.logger.log(
        `Deregistered service with etcd: ${this.registration.getInstanceId()}`
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  async register(): Promise<void> {
    this.logger.log(
      `registering service with id: ${this.registration.getInstanceId()}`
    );
    try {
      const service = this.generateService();
      const loop = true;

      while (loop) {
        try {
          const lease = await this.etcd.client
            .namespace(this.namespace)
            .lease(this.options.heartbeat.ttlInSeconds || 200);
          await lease
            .put(this.registration.getInstanceId())
            .value(JSON.stringify(service))
            .exec();
          lease.on('lost', async () => {
            lease.removeAllListeners('lost');
            await sleep(5000);
            await this.register();
          });
          this.logger.log('service registered');
          break;
        } catch (e) {
          this.logger.error(`problem registering service, retrying...`, e);
          await sleep((this.options.heartbeat.ttlInSeconds || 5) * 1000);
        }
      }

      if (
        this.options.heartbeat.enabled &&
        this.ttlScheduler != null &&
        this.options.heartbeat.ttlInSeconds != null
      ) {
        this.ttlScheduler.add(this.registration.getInstanceId());
      }
    } catch (e) {
      if (this.options.discovery.failFast) {
        throw e;
      }
      this.logger.warn(
        `Fail fast is false. Error registering service with etcd: ${this.registration.getService()} ${e}`
      );
    }
  }

  setStatus(status: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  private getServiceInst(value: any): ServiceInstance {
    const parsedData = JSON.parse(value.toString()) as Service;
    let instance: ServiceInstance;
    if (isPlainObject(parsedData)) {
      instance = serviceToInstance(parsedData);
    }
    return instance;
  }

  private addToServiceStore(res: IWatchResponse, name?: string) {
    const event = res.events.filter((e) => !e.prev_kv)[0];
    if (!event) {
      return;
    }

    if (event.type === 'Delete') {
      const key = event.kv.key.toString();
      const serviceName = key.split('__')[1];
      this.serviceStore.removeServiceNode(serviceName, key);
    } else if (event.type === 'Put') {
      if (event.kv.value && event.kv.value.toString()) {
        try {
          const instance = this.getServiceInst(event.kv.value);
          this.serviceStore.addService(
            name || instance.getServiceId(),
            instance
          );
        } catch (e) {
          this.logger.error(e);
        }
      } else {
        this.logger.error(`invalid value format for path: [${name}]`);
      }
    }
  }

  async watch(
    serviceName: string,
    callback: (event: 'register' | 'deregister', data: any) => void
  ) {
    let key = serviceName;
    if (!key.startsWith('service__')) {
      key = `service__${key}`;
    }

    if (this.watchers[key]) {
      // this.watchers[serviceName].
    }

    this.watchers[key] = await this.etcd.client
      .namespace(this.namespace)
      .watch()
      .key(key)
      .create();

    const watcher = this.watchers[key];
    watcher.on('data', (res: IWatchResponse) => {
      const event = res.events.filter((e) => !e.prev_kv)[0];
      if (!event) {
        return;
      }

      if (event.type === 'Delete') {
        callback('deregister', null);
      } else if (event.type === 'Put') {
        if (event.kv.value && event.kv.value.toString()) {
          try {
            const parsedData = JSON.parse(event.kv.value.toString()) as Service;
            let instance = {};
            if (isPlainObject(parsedData)) {
              instance = serviceToInstance(parsedData);
            }
            callback('register', instance);
          } catch (e) {
            this.logger.error(e);
          }
        } else {
          this.logger.error(`invalid value format for path: [${name}]`);
        }
      }
    });
  }

  private async watchAll() {
    const services = await this.etcd.client
      .namespace(this.namespace)
      .getAll()
      .json();
    const groupedService = _.groupBy(services, 'name');
    if (!_.isEmpty(groupedService)) {
      for (const key in groupedService) {
        if (groupedService.hasOwnProperty(key)) {
          const value = [];
          for (const keyElement of groupedService[key]) {
            value.push(serviceToInstance(keyElement));
          }
          this.serviceStore.setServices(key, value);
        }
      }
    }

    this.watcher = await this.etcd.client
      .namespace(this.namespace)
      .watch()
      .prefix('')
      .create();

    this.watcher.on('data', (res: IWatchResponse) => {
      this.addToServiceStore(res);
    });
  }
}
