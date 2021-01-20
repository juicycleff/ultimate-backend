import _ from 'lodash';
import { DiscoveryClient, ServiceInstance } from '../../interfaces';
import { DefaultServiceInstance } from '../../registry';
import { ConsulUtils } from './utils/consul-utils';
import { consul, Consul } from '@ultimate-backend/consul';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConsulDiscoveryClient implements DiscoveryClient {
  logger = new Logger('ConsulDiscoveryClient');

  constructor(readonly consul: Consul) {}

  async init() {
    await this.logger.log('ConsulDiscoveryClient initiated');
  }

  description(): string {
    return 'Consul Discovery Client';
  }

  async getInstances(serviceId: string): Promise<ServiceInstance[]> {
    return this.addInstancesToList(serviceId);
  }

  private async addInstancesToList(
    serviceId: string
  ): Promise<ServiceInstance[]> {
    const token = this.consul.options.aclToken;

    let serviceOptions: consul.Health.ServiceOptions = {
      service: serviceId,
      passing: this.consul.options.passing,
    };

    if (token) {
      serviceOptions = { ...serviceOptions, token: token };
    }

    const healthServices: any[] = await (
      await this.consul.client
    ).health.service(serviceOptions);

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
        metadata
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
    const allServices = await Promise.all(
      services.map((serviceId) => this.addInstancesToList(serviceId))
    );

    return _.flatten(allServices);
  }

  async getServices(): Promise<string[]> {
    const token = this.consul.options.aclToken;

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
