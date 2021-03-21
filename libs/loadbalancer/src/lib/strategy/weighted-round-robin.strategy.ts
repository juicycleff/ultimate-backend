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
 * File name:         weighted-round-robin.strategy.ts
 * Last modified:     02/03/2021, 01:35
 ******************************************************************************/
import { Injectable } from '@nestjs/common';
import { LoadBalancerStrategy } from '../decorators';
import { BaseStrategy, LoggerUtil, ServiceInstance } from '@ultimate-backend/common';
import { ServiceInstancePool } from '../service-instance-pool';

/**
 * Weighted round robin strategy
 */
@LoadBalancerStrategy()
@Injectable()
export class WeightedRoundRobinStrategy extends BaseStrategy<ServiceInstance> {
  private logger = new LoggerUtil(WeightedRoundRobinStrategy.name);
  private serviceId: String;
  private serviceInstanceList: ServiceInstancePool;
  counter = 0;
  currentWeight = 0;

  init(serviceName: string, list: ServiceInstancePool) {
    this.serviceId = serviceName;
    this.serviceInstanceList = list as ServiceInstancePool;
  }

  /**
   * Choose a service instance from the list of service pool
   */
  choose(): ServiceInstance {
    const liveServices = this.serviceInstanceList.get();
    const liveServicesCount = liveServices.length;

    if (liveServicesCount === 0) {
      this.logger.error(
        `no live servers available for service: ${this.serviceId}`
      );
      return null;
    }

    if (this.counter >= liveServicesCount) {
      this.counter = 0;
    }

    if (liveServices[this.counter]?.weight && this.currentWeight < liveServices[this.counter].weight) {
      this.currentWeight++;
      return liveServices[this.counter];
    }

    this.currentWeight = 0;
    return liveServices[this.counter++];
  }
}
