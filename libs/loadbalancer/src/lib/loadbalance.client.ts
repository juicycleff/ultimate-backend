import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
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
import { ServerCriticalException } from '../../../common/src/lib/exceptions';
import { Observable } from 'rxjs';

@Injectable()
export class LoadBalancerClient
  implements ILoadBalancerClient, ServiceInstanceChooser, OnModuleInit {
  constructor(
    @InjectLoadbalancerConfig()
    private readonly properties: LoadbalancerConfig,
    private readonly serviceStore: ServiceStore,
    private readonly registry: StrategyRegistry
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

  private createStrategy(
    serviceName: string,
    nodes: ServiceInstance[],
    strategy: BaseStrategy<any>
  ) {
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
  async execute<T>(
    serviceId: string,
    nodeOrRequest: LoadBalancerRequest<T> | ServiceInstance,
    request?: LoadBalancerRequest<T>
  ): Promise<T> {
    if (!serviceId) {
      throw new Error('serviceId is missing');
    }

    const [req, node] = request
      ? [request as LoadBalancerRequest<T>, nodeOrRequest as ServiceInstance]
      : [undefined, nodeOrRequest as ServiceInstance];

    if (node) {
      node.getState().incrementActiveRequests();
      node.getState().incrementRequestCounts();
      if (!node.getState().firstConnectionTimestamp) {
        node.getState().setFirstConnectionTime();
      }
    }

    const startTime = new Date().getTime();
    try {
      const firstReq = req.arguments[0];
      const path = req.arguments[1];
      const opts = req.arguments[2];
      const response = await firstReq(path, opts);
      const endTime = new Date().getTime();
      node.getState().setResponseTime(endTime - startTime);
      node.getState().decrementActiveRequests();
      return response;
    } catch (e) {
      node.getState().decrementActiveRequests();
      if (e.response) {
        throw new HttpException(e.response.data, e.response.status);
      } else if (e.request) {
        node.getState().incrementFailureCounts();
        node.getState().setConnectionFailedTime(e.message);
        throw new ServerCriticalException(e.message);
      } else {
        node.getState().incrementFailureCounts();
        node.getState().setConnectionFailedTime(e.message);
        throw new ServerCriticalException(e.message);
      }
    }
  }

  /**
   * Execute grpc request
   *
   * @param serviceId
   * @param request
   */
  executeGrpc<T>(serviceId: string, request: LoadBalancerRequest<T>): T;
  executeGrpc<T>(
    serviceId: string,
    node: ServiceInstance,
    request: Observable<T>
  ): T;
  executeGrpc<T>(
    serviceId: string,
    nodeOrRequest: LoadBalancerRequest<T> | ServiceInstance,
    request?: Observable<T>
  ): Observable<T> {
    if (!serviceId) {
      throw new Error('serviceId is missing');
    }

    const [observable, node] = request
      ? [request as Observable<T>, nodeOrRequest as ServiceInstance]
      : [undefined, nodeOrRequest as ServiceInstance];

    if (node) {
      node.getState().incrementActiveRequests();
      node.getState().incrementRequestCounts();
      if (!node.getState().firstConnectionTimestamp) {
        node.getState().setFirstConnectionTime();
      }
    }

    const startTime = new Date().getTime();

    return new Observable((observer) => {
      observable.subscribe({
        error: (err) => {
          if (node) {
            node.getState().decrementActiveRequests();
            node.getState().incrementFailureCounts();
          }
          observer.error(err);
        },
        complete: () => {
          if (node) {
            const endTime = new Date().getTime();
            node.getState().setResponseTime(endTime - startTime);
            node.getState().decrementActiveRequests();
          }
          observer.complete();
        },
        next: (data) => {
          observer.next(data);
        },
      });
    });
  }

  onModuleInit(): any {
    this.init();
  }
}
