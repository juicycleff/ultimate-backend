import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import retry from 'retry';
import { ConsulRegistrationBuilder } from './consul-registration.builder';
import { ConsulDiscoveryClient } from './consul-discovery-client';
import {
  ConsulRegistryProviderOptions,
  ServiceRegistration,
} from '../../interfaces';
import { ConsulRegistration } from './consul-registration';
import { TtlScheduler } from './ttl-scheduler';
import { consul } from '@ultimate-backend/consul';
import { CLOUD_REGISTRY_CONFIG } from '../../cloud.constants';

@Injectable()
export class ConsulServiceRegistry
  implements
    ServiceRegistration<ConsulRegistration>,
    OnModuleInit,
    OnModuleDestroy {
  registration: ConsulRegistration;
  ttlScheduler?: TtlScheduler;
  logger = new Logger('ConsulServiceRegistry');

  constructor(
    private readonly client: ConsulDiscoveryClient,
    @Inject(CLOUD_REGISTRY_CONFIG)
    private readonly options: ConsulRegistryProviderOptions
  ) {}

  async init() {
    if (this.options.heartbeat == null)
      throw Error('HeartbeatOptions is required');

    if (this.options.discovery == null)
      throw Error('ConsulDiscoveryOptions is required.');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.registration = new ConsulRegistrationBuilder()
      .discoveryOptions(this.options.discovery)
      .heartbeatOptions(this.options.heartbeat)
      .host(this.options.service?.address)
      .port(this.options.service?.port)
      .serviceName(this.options.service?.name)
      .instanceId(this.options.service?.id)
      .build();

    if (this.options.heartbeat.enabled) {
      console.log('consul');
      this.ttlScheduler = new TtlScheduler(
        this.options.heartbeat,
        await this.client.consul.client
      );
    }
  }

  async register(): Promise<void> {
    this.logger.log(
      `registering service with id: ${this.registration.getInstanceId()}`
    );
    try {
      const token = this.client.consul.options.aclToken
        ? { token: this.client.consul.options.aclToken }
        : {};

      const options = {
        ...this.registration.getService(),
        ...token,
      };

      console.log('Consul');
      await (await this.client.consul.client).agent.service.register(options);

      const service = this.registration.getService();
      if (
        this.options.heartbeat.enabled &&
        this.ttlScheduler != null &&
        service.check?.ttl != null
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

  async deregister(): Promise<void> {
    this.logger.log(
      `Deregistering service with consul: ${this.registration.getInstanceId()}`
    );
    this.ttlScheduler?.remove(this.registration.getInstanceId());

    const token = this.client.consul.options.aclToken
      ? { token: this.client.consul.options.aclToken }
      : {};
    const options = { id: this.registration.getInstanceId(), ...token };
    await (await this.client.consul.client).agent.service.deregister(options);
  }

  close(): void {
    // not implemented
  }

  async setStatus(
    registration: ConsulRegistration,
    status: string
  ): Promise<void> {
    if (status == 'OUT_OF_SERVICE') {
      // enable maintenance mode
      await (await this.client.consul.client).agent.service.maintenance({
        id: registration.getInstanceId(),
        enable: true,
      });
    } else if (status == 'UP') {
      // TODO
    }

    throw new Error('Unknown status ' + status);
  }

  async getStatus<T>(registration: ConsulRegistration): Promise<T> {
    const checks: any[] = await (await this.client.consul.client).health.checks(
      registration.getServiceId()
    );
    for (const check of checks) {
      if (check['ServiceID'] == registration.getInstanceId()) {
        if (check['Name'] == 'Service Maintenance Mode') {
          return JSON.parse(JSON.stringify({ status: 'OUT_OF_SERVICE' }));
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
