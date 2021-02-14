import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import retry from 'retry';
import { ConsulRegistration } from './consul-registration';
import { consul, ConsulService } from '@ultimate-backend/consul';
import {
  SERVICE_REGISTRY_CONFIG,
  ServiceRegistry,
} from '@ultimate-backend/common';
import { TtlScheduler } from '../discovery';
import { ConsulRegistryOptions } from './consul-registry.options';
import { ConsulRegistrationBuilder } from './consul-registration.builder';

@Injectable()
export class ConsulServiceRegistry
  implements
    ServiceRegistry<ConsulRegistration>,
    OnModuleInit,
    OnModuleDestroy {
  registration: ConsulRegistration;
  ttlScheduler?: TtlScheduler;
  logger = new Logger('ConsulServiceRegistry');

  constructor(
    private readonly client: ConsulService,
    @Inject(SERVICE_REGISTRY_CONFIG)
    private readonly options: ConsulRegistryOptions
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
      this.ttlScheduler = new TtlScheduler(
        this.options.heartbeat,
        this.client
      );
    }
  }

  async register(): Promise<void> {
    this.logger.log(
      `registering service with id: ${this.registration.getInstanceId()}`
    );
    try {
      const token = this.client.options.aclToken
        ? { token: this.client.options.aclToken }
        : {};

      const options = {
        ...this.registration.getService(),
        ...token,
      };

      await this.client.consul.agent.service.register(options);

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

    const token = this.client.options.aclToken
      ? { token: this.client.options.aclToken }
      : {};
    const options = { id: this.registration.getInstanceId(), ...token };
    await this.client.consul.agent.service.deregister(options);
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
