import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ServiceInstanceChooser, ILoadBalancerClient } from './interface';
import {
  BaseStrategy,
  ServiceInstance,
  ServiceStore,
} from '@ultimate-backend/common';
import { LoadBalancerRequest } from './core';
import { LOAD_BALANCE_CONFIG_OPTIONS } from './loadbalancer.constant';
import { LoadBalancerModuleOptions } from './loadbalancer-module.options';

@Injectable()
export class LoadBalancerClient
  implements ILoadBalancerClient, ServiceInstanceChooser, OnModuleInit {
  constructor(
    @Inject(LOAD_BALANCE_CONFIG_OPTIONS)
    private readonly properties: LoadBalancerModuleOptions,
    private readonly serviceStore: ServiceStore
  ) {}

  private readonly serviceStrategies = new Map<
    string,
    BaseStrategy<ServiceInstance>
  >();

  private init() {
    this.updateServices();

    this.serviceStore.watch(() => {
      this.updateServices();
    });
  }

  private updateServices() {
    const services = this.serviceStore.getServiceNames();
    for (const service of services) {
      const nodes = this.serviceStore.getServiceNodes(service);

      // console.log(service, nodes);

      if (!service || this.serviceStrategies.has(service)) {
        return;
      }
    }
  }

  choose(serviceId: string): ServiceInstance {
    const strategy = this.serviceStrategies.get(serviceId);
    if (!strategy) {
      throw new Error(`service [${serviceId}] does not exist`);
    }

    return strategy.choose();
  }

  chooseStrategy(serviceId: string): BaseStrategy<ServiceInstance> {
    const strategy = this.serviceStrategies.get(serviceId);
    if (!strategy) {
      throw new Error(`service [${serviceId}] does not exist`);
    }

    return strategy;
  }

  /**
   * Execute request
   *
   * @param serviceId
   * @param request
   */
  execute<T>(serviceId: string, request: LoadBalancerRequest<T>): T;
  execute<T>(
    serviceId: string,
    serviceInstance: ServiceInstance,
    request: LoadBalancerRequest<T>
  ): T;
  execute<T>(
    serviceId: string,
    serviceInstanceOrRequest: LoadBalancerRequest<T> | ServiceInstance,
    request?: LoadBalancerRequest<T>
  ): T {
    if (!serviceId) {
      throw new Error('serviceId is missing');
    }

    const [req, serviceInstance] = request
      ? [
          request as LoadBalancerRequest<T>,
          serviceInstanceOrRequest as ServiceInstance,
        ]
      : [undefined, serviceInstanceOrRequest as ServiceInstance];

    return undefined;
  }

  onModuleInit(): any {
    this.init();
  }
}
