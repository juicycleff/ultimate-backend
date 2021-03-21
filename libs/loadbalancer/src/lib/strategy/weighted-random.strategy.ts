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
 * File name:         weighted-random.strategy.ts
 * Last modified:     02/03/2021, 01:39
 ******************************************************************************/
import { RandomStrategy } from './random.strategy';
import { Injectable } from '@nestjs/common';
import { random } from 'lodash';
import { LoadBalancerStrategy } from '../decorators';
import { BaseStrategy, LoggerUtil, ServiceInstance } from '@ultimate-backend/common';
import { ServiceInstancePool } from '../service-instance-pool';

/**
 * weighted random load-balance strategy
 */
@LoadBalancerStrategy()
@Injectable()
export class WeightedRandomStrategy extends BaseStrategy<ServiceInstance> {
  private logger = new LoggerUtil(RandomStrategy.name);
  private serviceId: String;
  private serviceInstanceList: ServiceInstancePool;
  currentWeight = 0;
  currentIdx = 0;

  init(serviceName: string, list: ServiceInstancePool) {
    this.serviceId = serviceName;
    this.serviceInstanceList = list;
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

    if (liveServices[this.currentIdx]?.weight && this.currentWeight < liveServices[this.currentIdx].weight) {
      this.currentWeight++;
      return liveServices[this.currentIdx];
    }

    this.currentWeight = 0;
    this.currentIdx = random(0, liveServicesCount - 1)
    return liveServices[this.currentIdx];
  }
}
