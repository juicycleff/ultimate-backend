import _ from 'lodash';
import { MdnsOptions } from './interfaces';
import { Injectable } from '@nestjs/common';
import { DiscoveryClient, ServiceInstance } from '@ultimate-backend/common';

@Injectable()
export class MdnsDiscoveryClient implements DiscoveryClient {
  constructor(private _options: MdnsOptions) {}

  description(): string {
    return 'MDNS Discovery Client';
  }

  async getInstances(serviceId: string): Promise<ServiceInstance[]> {
    return this.addInstancesToList(serviceId);
  }

  private async addInstancesToList(
    _serviceId: string
  ): Promise<ServiceInstance[]> {
    return null;
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

  private getMetadata(_tags: string[]): Map<string, string> {
    return null;
  }

  async getAllInstances(): Promise<ServiceInstance[]> {
    const services = await this.getServices();
    const allServices = await Promise.all(
      services.map((serviceId) => this.addInstancesToList(serviceId))
    );

    return _.flatten(allServices);
  }

  async getServices(): Promise<string[]> {
    return null;
  }
}
