import * as Consul from 'consul';
import _ from 'lodash';
import { DiscoveryClient, ServiceInstance } from '../../interfaces';
import { DefaultServiceInstance } from '../../registry';
import { ConsulUtils } from './utils/consul-utils';
import { ConsulOptions } from './interfaces';
import { ConsulClient } from './consul.client';

export class ConsulDiscoveryClient implements DiscoveryClient {
  consul: ConsulClient;

  constructor(private consulOptions: ConsulOptions) {
    this.consul = new ConsulClient();
    this.init();
  }

  async init() {
    await this.consul.connect({
      host: this.consulOptions.host,
      port: `${this.consulOptions.port}`,
      promisify: true,
      secure: this.consulOptions.secure,
    });
  }

  description(): string {
    return 'Consul Discovery Client';
  }

  async getInstances(serviceId: string): Promise<ServiceInstance[]> {
    return this.addInstancesToList(serviceId);
  }

  private async addInstancesToList(serviceId: string): Promise<ServiceInstance[]> {
    const token = this.consulOptions.aclToken;

    let serviceOptions: Consul.Health.ServiceOptions = {
      service: serviceId,
      passing: this.consulOptions.passing,
    };

    if (token) {
      serviceOptions = { ...serviceOptions, token: token };
    }

    const healthServices: any[] = await (await this.consul.client).health.service(serviceOptions);

    return healthServices.map((healthService) => {
      const host = this.findHost(healthService);
      const metadata = this.getMetadata(healthService.Service.Tags || []);
      let secure = false;
      if (metadata.has('secure')) {
        secure = /true/i.test(metadata.get('secure') || '');
      }

      return new DefaultServiceInstance(
        healthService.Service.ID,
        serviceId,
        host,
        healthService.Service.Port,
        secure,
        metadata,
      );
    });
  }

  private findHost(healthService): string {
    const service = healthService.Service;
    const node = healthService.Node;

    if (service.Address) {
      return service.Address;
    } else if (node.Address) {
      return node.Address;
    }

    return node.Node;
  }

  private getMetadata(tags: string[]): Map<string, string> {
    return ConsulUtils.getMetadata(tags);
  }

  async getAllInstances(): Promise<ServiceInstance[]> {
    const services = await this.getServices();
    const allServices = await Promise.all(services.map((serviceId) => this.addInstancesToList(serviceId)));

    return _.flatten(allServices);
  }

  async getServices(): Promise<string[]> {
    const token = this.consulOptions.aclToken;

    let services;
    if (token) {
      services = await (await this.consul.client).catalog.services({
        token: token,
      });
    } else {
      services = await (await this.consul.client).catalog.services();
    }

    return Object.keys(services);
  }
}
