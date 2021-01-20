import { LocalRegistryProviderOptions, ServiceRegistration } from '../../index';
import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MdnsRegistration } from './mdns-registration';
import { MdnsRegistrationBuilder } from './mdns-registration.builder';
import * as mdns from 'mdns';
import { CLOUD_REGISTRY_CONFIG } from '../../cloud.constants';

export class MdnsServiceRegistry
  implements
    ServiceRegistration<MdnsRegistration>,
    OnModuleInit,
    OnModuleDestroy {
  logger = new Logger('MdnsServiceRegistry');

  registration: MdnsRegistration;
  browser: mdns.Browser = mdns.createBrowser(mdns.tcp('http'));

  advertiser: mdns.Advertisement;

  constructor(
    @Inject(CLOUD_REGISTRY_CONFIG)
    private readonly options: LocalRegistryProviderOptions
  ) {
    this.init();
  }

  async init() {
    if (this.options.heartbeat == null)
      throw Error('HeartbeatOptions is required');

    if (this.options.service == null)
      throw Error('Service options is required.');

    this.advertiser = mdns.createAdvertisement(
      mdns.tcp('http'),
      this.options.service.port,
      {
        host: this.options.service.address,
        name: this.options.service.name,
        domain: this.options.service.domain,
        context: this.options.service.id,
      }
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.registration = new MdnsRegistrationBuilder()
      .discoveryOptions(this.options.discovery)
      .heartbeatOptions(this.options.heartbeat)
      .host(this.options.service?.address)
      .port(this.options.service?.port)
      .serviceName(this.options.service?.name)
      .instanceId(this.options.service?.id)
      .build();

    if (this.options.heartbeat.enabled) {
      // this.ttlScheduler = new TtlScheduler(this.options.heartbeat, null);
    }

    this.browser.on('serviceUp', (service) => {
      console.log('service up: ', service);
    });

    this.browser.on('serviceChanged', (service) => {
      // console.log('service changed: ', service);
    });

    this.browser.on('error', (exception) => {
      console.log('service error: ', exception);
    });

    this.browser.on('serviceDown', (service) => {
      console.log('service down: ', service);
    });

    await this.browser.start();
  }

  async close(): Promise<void> {
    await this.advertiser.stop();
    await this.advertiser.removeAllListeners();
    await this.browser.removeAllListeners();
  }

  async deregister(): Promise<void> {
    this.logger.log(
      `Deregistering service with mdns: ${this.registration.getInstanceId()}`
    );
    // this.ttlScheduler?.remove(this.registration.getInstanceId());
    return this.advertiser.stop();
  }

  async register(): Promise<void> {
    try {
      this.logger.log(
        `registering service with id: ${this.registration.getInstanceId()}`
      );

      const options = this.registration.getService();

      this.advertiser = mdns.createAdvertisement(
        mdns.tcp('http'),
        options.port,
        {
          host: options.address,
          name: options.name,
          domain: options.domain,
          context: options.id,
        }
      );

      this.advertiser.on('error', (exception) => {
        console.log('advertiser error: ', exception);
      });

      await this.advertiser.start();

      const service = this.registration.getService();
      if (
        this.options.heartbeat.enabled &&
        // this.ttlScheduler != null &&
        service.check?.ttl != null
      ) {
        // this.ttlScheduler.add(this.registration.getInstanceId());
      }
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
    await this.register();
  }

  setStatus(registration: MdnsRegistration, status: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}
