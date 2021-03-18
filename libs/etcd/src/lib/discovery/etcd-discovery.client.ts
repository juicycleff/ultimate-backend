import _ from 'lodash';
import { EtcdClient } from '../etcd.client';
import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryClient, PlainObject, ServiceInstance } from '@ultimate-backend/common';
import { EtcdServiceInstance } from './etcd-service.instance';

@Injectable()
export class EtcdDiscoveryClient implements DiscoveryClient {
  logger = new Logger(EtcdDiscoveryClient.name);
  // ub-service/service__${serviceName}__${ip}__${port}__<version (optional)>
  private readonly namespace = 'ub-service/';

  constructor(readonly etcd: EtcdClient) {}

  async init() {
    this.logger.log('discovery initiated');
  }

  description(): string {
    return 'EtcdClient Discovery Client';
  }

  async getInstances(serviceId: string): Promise<ServiceInstance[]> {
    return this.addInstancesToList(serviceId);
  }

  private async addInstancesToList(
    serviceId: string
  ): Promise<ServiceInstance[]> {
    /* const token = this.Etcd.options.aclToken;

    let serviceOptions: Etcd.Health.ServiceOptions = {
      service: serviceId,
      passing: this.Etcd.options.passing,
    };

    const healthServices: any[] = await (await this.Etcd).health.service(
      serviceOptions
    ); */
    const healthServices: any[] = [];
    return healthServices.map((healthService) => {
      const host = this.findHost(healthService);
      const metadata = this.getMetadata(healthService.Service.Tags || []);
      let secure = false;
      if (metadata?.secure) {
        secure = /true/i.test(metadata.get('secure') || '');
      }

      return new EtcdServiceInstance({
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
    return {}
  }

  async getAllInstances(): Promise<ServiceInstance[]> {
    const services = await this.getServices();
    const allServices = await Promise.all(
      services.map((serviceId) => this.addInstancesToList(serviceId))
    );

    return _.flatten(allServices);
  }

  async getServices(): Promise<string[]> {
    const services = await this.etcd.namespace(this.namespace).getAll().buffers();
    return Object.keys(services);
  }
}
