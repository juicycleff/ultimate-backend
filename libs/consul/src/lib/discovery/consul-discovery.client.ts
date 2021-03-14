import _ from 'lodash';
import { consul, ConsulService } from '@ultimate-backend/consul';
import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryClient, PlainObject, ServiceInstance } from '@ultimate-backend/common';
import { ConsulUtils } from '../utils';
import { ConsulServiceInstance } from './consul-service.instance';

@Injectable()
export class ConsulDiscoveryClient implements DiscoveryClient {
  logger = new Logger(ConsulDiscoveryClient.name);

  constructor(readonly consul: ConsulService) {}

  async init() {
    await this.logger.log('ConsulDiscoveryClient initiated');
  }

  description(): string {
    return 'ConsulService Discovery Client';
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

    const healthServices: any[] = await (await this.consul).health.service(
      serviceOptions
    );

    return healthServices.map((healthService) => {
      const host = this.findHost(healthService);
      const metadata = this.getMetadata(healthService.Service.Tags || []);
      let secure = false;
      if (metadata?.secure) {
        secure = /true/i.test(metadata.get('secure') || '');
      }

      return new ConsulServiceInstance({
        instanceId: healthService.Service.ID,
        serviceId,
        host,
        port: healthService.Service.Port,
        secure,
        metadata,
      });
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

  private getMetadata(tags: string[]): PlainObject {
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
      services = await this.consul.catalog.services({
        token: token,
      });
    } else {
      services = await this.consul.catalog.services();
    }

    return Object.keys(services);
  }
}
