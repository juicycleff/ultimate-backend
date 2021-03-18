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
 * File name:         discovery-client-service-instance-list.ts
 * Last modified:     09/03/2021, 13:38
 ******************************************************************************/
import { ServiceInstanceList } from './service-instance-list';
import { StrategyInstanceListBuilder } from './strategy-instance-list.builder';
import {
  DiscoveryClient,
  LoggerUtil,
  ServiceInstance,
} from '@ultimate-backend/common';
import { defer, BehaviorSubject, of } from 'rxjs';
import { catchError, timeoutWith } from 'rxjs/operators';

export class DiscoveryClientServiceInstanceList implements ServiceInstanceList {
  private logger = new LoggerUtil(
    DiscoveryClientServiceInstanceList.name,
    true
  );

  private readonly serviceId: string;

  private timeout = 30000;

  private serviceInstances: BehaviorSubject<Array<ServiceInstance>>;

  constructor(delegate: DiscoveryClient, serviceId: string) {
    this.serviceId = serviceId;

    defer(async () => {
      const instances = await delegate.getInstances(serviceId);
      this.serviceInstances = new BehaviorSubject(instances);
    }).pipe(
      timeoutWith(this.timeout, of(this.logTimeout())),
      catchError((err) => {
        this.logError(err);
        return (this.serviceInstances = new BehaviorSubject(null));
      })
    );
  }

  static builder(): StrategyInstanceListBuilder {
    return undefined;
  }

  getServiceId(): string {
    return this.serviceId;
  }

  public get(): BehaviorSubject<Array<ServiceInstance>> {
    return this.serviceInstances;
  }

  private logTimeout() {
    this.logger
      .debug(`Timeout occurred while retrieving instances for service ${
      this.serviceId
    }.'
        The instances could not be retrieved during ${this.timeout / 1000}s"`);
  }

  private logError(error: Error) {
    this.logger.error(
      `Exception occurred while retrieving instances for service ${this.serviceId}, error: ${error}`
    );
  }
}
