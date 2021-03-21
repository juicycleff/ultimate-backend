import { Injectable, OnModuleInit } from '@nestjs/common';
import { ServiceInstanceChooser, ILoadBalancerClient } from './interface';
import {
  BaseStrategy,
  ServiceInstance,
  ServiceStore,
} from '@ultimate-backend/common';
import { LoadBalancerRequest } from './core';
import { InjectLoadbalancerConfig } from './decorators';
import { LoadbalancerConfig } from './loadbalancer.config';
import { StrategyRegistry } from './strategy.registry';
import { ServiceInstancePool } from './service-instance-pool';

@Injectable()
export class LoadBalancerClient
  implements ILoadBalancerClient, ServiceInstanceChooser, OnModuleInit {
  constructor(
    @InjectLoadbalancerConfig()
    private readonly properties: LoadbalancerConfig,
    private readonly serviceStore: ServiceStore,
    private readonly registry: StrategyRegistry,
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

      if (!service || this.serviceStrategies.has(service)) {
        return;
      }

      const strategyName = this.properties.getStrategy(service);
      const strategy = this.registry.getStrategy(strategyName);
      if (strategy) {
        this.createStrategy(service, nodes, strategy);
      }
    }
  }

  private createStrategy(serviceName: string, nodes: ServiceInstance[], strategy: BaseStrategy<any>) {
    strategy.init(serviceName, new ServiceInstancePool(serviceName, nodes));
    this.serviceStrategies.set(serviceName, strategy);
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
    node: ServiceInstance,
    request: LoadBalancerRequest<T>
  ): T;
  execute<T>(
    serviceId: string,
    nodeOrRequest: LoadBalancerRequest<T> | ServiceInstance,
    request?: LoadBalancerRequest<T>
  ): T {
    if (!serviceId) {
      throw new Error('serviceId is missing');
    }

    const [req, node] = request
      ? [request as LoadBalancerRequest<T>, nodeOrRequest as ServiceInstance]
      : [undefined, nodeOrRequest as ServiceInstance];

    return undefined;
  }

  onModuleInit(): any {
    this.init();
  }
}
