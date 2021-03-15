import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import retry from 'retry';
import _ from 'lodash';
import { ConsulRegistration } from './consul-registration';
import { consul, ConsulClient } from '@ultimate-backend/consul';
import {
  Registration,
  SERVICE_REGISTRY_CONFIG,
  ServiceRegistry, ServiceStore, sleep,
} from '@ultimate-backend/common';
import { TtlScheduler } from '../discovery';
import { ConsulRegistryOptions } from './consul-registry.options';
import { ConsulRegistrationBuilder } from './consul-registration.builder';
import { Watch } from 'consul';
import * as Consul from 'consul';
import RegisterOptions = Consul.Agent.Service.RegisterOptions;
import { Service } from '../consul.interface';
import { consulServiceToServiceInstance } from '../utils';

@Injectable()
export class ConsulServiceRegistry
  implements
    ServiceRegistry<ConsulRegistration>,
    OnModuleInit,
    OnModuleDestroy {

  watcher: Watch;
  registration: Registration<Service>;
  ttlScheduler?: TtlScheduler;
  logger = new Logger(ConsulServiceRegistry.name);
  private readonly WATCH_TIMEOUT = 305000;
  private watchers: Map<string, Watch> = new Map();

  constructor(
    private readonly client: ConsulClient,
    @Inject(SERVICE_REGISTRY_CONFIG)
    private readonly options: ConsulRegistryOptions,
    private readonly serviceStore: ServiceStore
  ) {}

  async init() {
    if (this.options.heartbeat == null)
      throw Error('HeartbeatOptions is required');

    if (this.options.discovery == null)
      throw Error('ConsulDiscoveryOptions is required.');

    this.registration = new ConsulRegistrationBuilder()
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
      this.ttlScheduler = new TtlScheduler(this.options.heartbeat, this.client);
    }

    // watch for service change
    this.watchAll();
  }

  private getToken(): { token?: string } {
    return this.client.options.aclToken
      ? { token: this.client.options.aclToken }
      : {};
  }

  private generateService(): RegisterOptions {
    let check = this.registration.getService().check;
    check = _.omitBy(check, _.isUndefined);

    return {
      ...this.options.service,
      ...this.registration.getService(),
      check,
      ...this.getToken(),
    };
  }

  async register(): Promise<void> {
    this.logger.log(
      `registering service with id: ${this.registration.getInstanceId()}`
    );

    const loop = true;
    while (loop) {
      try {
        const service = this.generateService();
        await this.client.consul.agent.service.register(service);

        if (
          this.options.heartbeat.enabled &&
          this.ttlScheduler != null &&
          service.check?.ttl != null
        ) {
          this.ttlScheduler.add(this.registration.getInstanceId());
        }

        this.logger.log('service registered');
        break;
      } catch (e) {
        if (this.options.discovery.failFast) {
          this.logger.warn(
            `Fail fast is false. Error registering service with consul: ${this.registration.getService()} ${e}`
          );
          throw e;
        }
        await sleep( (this.options.heartbeat.ttlInSeconds || 5) * 1000);
      }
    }

  }

  async deregister(): Promise<void> {
    this.logger.log(
      `Deregistering service with consul: ${this.registration.getInstanceId()}`
    );
    this.ttlScheduler?.remove(this.registration.getInstanceId());

    const options = {
      id: this.registration.getInstanceId(),
      ...this.getToken(),
    };
    await this.client.consul.agent.service.deregister(options);
  }

  close(): void {
    // not implemented
  }

  async setStatus(
    registration: ConsulRegistration,
    status: 'OUT_OF_SERVICE' | 'UP'
  ): Promise<void> {
    if (status == 'OUT_OF_SERVICE') {
      // enable maintenance mode
      await this.client.consul.agent.service.maintenance({
        id: registration.getInstanceId(),
        enable: true,
      });
    } else if (status == 'UP') {
      await this.client.consul.agent.service.maintenance({
        id: registration.getInstanceId(),
        enable: false,
      });
    } else {
      throw new Error('Unknown status ' + status);
    }
  }

  async getStatus<T>(registration: ConsulRegistration): Promise<T> {
    const checks: any[] = await this.client.consul.health.checks(
      registration.getServiceId()
    );

    for (const check of checks) {
      if (check['ServiceID'] == registration.getInstanceId()) {
        if (check['Name'] == 'Service Maintenance Mode') {
          return ({ status: 'OUT_OF_SERVICE' } as unknown) as T;
        }
      }
    }

    return JSON.parse(JSON.stringify({ status: 'UP' }));
  }

  async retryRegister(): Promise<any> {
    return new Promise<consul.Consul>((resolve, reject) => {
      const operation = retry.operation();
      operation.attempt(async () => {
        try {
          await this.register();
          resolve(null);
        } catch (e) {
          if (operation.retry(e)) {
            return;
          }
          reject(e);
        }
      });
    });
  }

  private async buildServiceStore(services: string[]) {
    this.watchers.forEach(watcher => watcher.end());
    this.watchers = new Map();

    await Promise.all(
      services.map(async (service: string) => {
        const nodes = await this.client.consul.health.service(service) as any[];
        const serviceNodes = consulServiceToServiceInstance(nodes);
        this.serviceStore.setServices(service, serviceNodes);
        this.watch(service);
      }),
    );
  }

  private watch(
    serviceName: string,
  ) {
    if (!this.client.consul) {
      return;
    }

    if (this.watchers[serviceName]) {
      this.watchers[serviceName].end();
    }

    this.watchers[serviceName] = this.client.consul.watch({
      method: this.client.consul.health.service,
      options: {
        timeout: this.WATCH_TIMEOUT,
        service: serviceName,
        wait: '5m',
        ...this.getToken(),
      },
    });
    const watcher = this.watchers[serviceName];

    watcher.on('change', (nodes) => {
      const serviceNodes = consulServiceToServiceInstance(nodes);
      this.serviceStore.setServices(serviceName, serviceNodes);
    });
  }

  private watchAll() {
    if (!this.client.consul) {
      return;
    }

    this.watcher = this.client.consul.watch({
      method: this.client.consul.catalog.service.list,
      options: {
        timeout: this.WATCH_TIMEOUT,
        wait: '5m',
      },
    });

    this.watcher.on('change', async (data) => {
      const svcs = Object.keys(data).filter(value => value !== 'consul');
      await this.buildServiceStore(svcs);
    });
  }

  async onModuleInit() {
    try {
      await this.init();
      await this.retryRegister();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async onModuleDestroy() {
    await this.deregister();
  }
}
