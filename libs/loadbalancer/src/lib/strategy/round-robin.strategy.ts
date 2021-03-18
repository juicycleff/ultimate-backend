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
 * File name:         round-robin.strategy.ts
 * Last modified:     02/03/2021, 01:34
 ******************************************************************************/
import {
  BaseStrategy,
  LoggerUtil,
  ServiceInstance,
} from '@ultimate-backend/common';
import { ServiceInstanceList } from '../service-instance-list';
import { Injectable } from '@nestjs/common';

/**
 * round robin load-balance strategy
 */
@Injectable()
export class RoundRobinStrategy extends BaseStrategy<ServiceInstance> {
  private logger = new LoggerUtil(RoundRobinStrategy.name);
  private serviceId: String;
  private serviceInstanceList: ServiceInstanceList;
  counter = 0;

  init(serviceName: string, list: ServiceInstanceList) {
    this.serviceId = serviceName;
    this.serviceInstanceList = list as ServiceInstanceList;
  }

  /**
   * Choose a service instance from the list of service pool
   */
  choose(): ServiceInstance {
    this.serviceInstanceList.get();
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

    return liveServices[this.counter++];
  }
}
