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
 * File name:         zookeeper-discovery.client.ts
 * Last modified:     17/03/2021, 01:15
 ******************************************************************************/
import {
  DiscoveryClient,
  PlainObject,
  ServiceInstance,
} from '@ultimate-backend/common';
import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { ZookeeperClient } from '../zookeeper.client';
import { ZookeeperServiceInstance } from './zookeeper-service.instance';

@Injectable()
export class ZookeeperDiscoveryClient implements DiscoveryClient {
  logger = new Logger(ZookeeperDiscoveryClient.name);
  // ub-service/service__${serviceName}__${ip}__${port}__<version (optional)>
  private readonly namespace = 'ub-service/';

  constructor(readonly client: ZookeeperClient) {}

  async init() {
    this.logger.log('discovery initiated');
  }

  description(): string {
    return 'Zookeeper Discovery Client';
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

      return new ZookeeperServiceInstance({
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
    return {};
  }

  async getAllInstances(): Promise<ServiceInstance[]> {
    const services = await this.getServices();
    const allServices = await Promise.all(
      services.map((serviceId) => this.addInstancesToList(serviceId))
    );

    return _.flatten(allServices);
  }

  async getServices(): Promise<string[]> {
    const services = await this.client.get_children(this.namespace, false);
    return Object.keys(services);
  }
}
