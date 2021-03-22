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
 * File name:         zookeeper-service-registry.ts
 * Last modified:     16/03/2021, 23:18
 ******************************************************************************/
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  LoggerUtil,
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
import { isPlainObject } from 'lodash';
import { ZookeeperRegistration } from './zookeeper-registration';
import { ZookeeperClient } from '../../';
import { ZookeeperRegistryOptions } from './zookeeper-registry.options';
import { ZookeeperRegistrationBuilder } from './zookeeper-registration.builder';
import { ZookeeperHeartbeatTask } from '../discovery';
const Zookeeper = require('zookeeper');

@Injectable()
export class ZookeeperServiceRegistry
  implements
    ServiceRegistry<ZookeeperRegistration>,
    OnModuleInit,
    OnModuleDestroy {
  // ub-service/service__${serviceName}__${ip}__${port}__<version (optional)>
  private readonly namespace = '/ub-service';

  watcher: any;
  registration: Registration<Service>;
  ttlScheduler?: TtlScheduler;
  logger = new Logger(ZookeeperServiceRegistry.name);
  private readonly WATCH_TIMEOUT = 305000;
  private watchers: Map<string, any> = new Map();

  constructor(
    private readonly client: ZookeeperClient,
    @Inject(SERVICE_REGISTRY_CONFIG)
    private readonly options: ZookeeperRegistryOptions,
    private readonly serviceStore: ServiceStore
  ) {}

  async init() {
    if (this.options.heartbeat == null)
      throw Error('HeartbeatOptions is required');

    if (this.options.discovery == null)
      throw Error('ZookeeperDiscoveryOptions is required.');

    this.registration = new ZookeeperRegistrationBuilder()
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
      const task = new ZookeeperHeartbeatTask(
        this.client,
        this.registration.getInstanceId()
      );
      this.ttlScheduler = new TtlScheduler(this.options.heartbeat, task);
    }

    await this.createNode();

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
      `Deregistering service with consul: ${this.registration.getInstanceId()}`
    );

    try {
      this.ttlScheduler?.remove(this.registration.getInstanceId());

      const key = [this.namespace, this.registration.getInstanceId()].join('/');

      const [stats] = ((await this.client.get(key, false)) as unknown) as any[];
      await this.client.delete_(key, stats.version);
      this.logger.log(
        `Deregistered service with zookeeper: ${this.registration.getInstanceId()}`
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async createNode() {
    try {
      await this.client.create(this.namespace, '', Zookeeper.ZOO_PERSISTENT);
    } catch (e) {
      // this.logger.error(e);
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
          const key = [this.namespace, this.registration.getInstanceId()].join(
            '/'
          );
          await this.client.create(
            key,
            Buffer.from(JSON.stringify(service)),
            Zookeeper.ZOO_PERSISTENT
          );
          this.logger.log('service registered');
          break;
        } catch (e) {
          this.logger.error(`problem registering service, retrying...`, e);
          await sleep(3000);
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
        `Fail fast is false. Error registering service with consul: ${this.registration.getService()} ${e}`
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

    try {
      await this.client.w_get(key, async (type, stat, path) => {
        const [, data] = await this.client.get(path, false);
        const parsedData = JSON.parse(data.toString());
        if (isPlainObject(parsedData)) {
          // callback(parsedData);
        }
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async watchAll() {
    if (!this.client.connected) {
      return;
    }
    await this.setWatch(this.storeUpdate);
  }

  private storeUpdate(
    children: Array<any>,
    store: ServiceStore,
    logger: LoggerUtil
  ) {
    try {
      // console.log('children => ', children);
    } catch (e) {
      logger.error(e);
    }
  }

  private async setWatch(callback: Function) {
    const [children] = await this.client.w_get_children2(
      this.namespace,
      async (type, stat, path) => {
        try {
          await this.setWatch(callback);
        } catch (e) {
          this.logger.error(e);
        }
      }
    );

    const calls = [];
    for (const child of children) {
      calls.push(this.client.get(child, false));
    }
    callback(children, this.serviceStore, this.logger);
  }
}
