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
 * File name:         service-registry.factory.ts
 * Last modified:     09/02/2021, 20:14
 ******************************************************************************/

import { Logger } from '@nestjs/common';
import { Registration } from './registration';
import { ServiceRegistry } from './service-registry';
import { ServiceInstance } from '../service-instance';

export class ServiceRegistryFactory {
  private static INSTANCE: ServiceRegistryFactory;

  private isRunning = false;

  private constructor(
    private registration: Registration<ServiceInstance>,
    private serviceRegistration: ServiceRegistry<Registration<ServiceInstance>>
  ) {}

  async register(): Promise<void> {
    if (this.isRunning) {
      return;
    }
    await this.serviceRegistration.register(this.registration);
    this.isRunning = true;
  }

  async deregister(): Promise<void> {
    await this.serviceRegistration.deregister(this.registration);
    this.isRunning = false;
  }

  /**
   *
   * @param registration
   * @param serviceRegistration
   * @returns ServiceRegistryFactory
   */
  static getInstance(
    registration: Registration<ServiceInstance>,
    serviceRegistration: ServiceRegistry<Registration<ServiceInstance>>
  ): ServiceRegistryFactory {
    if (registration == null)
      throw Error('an instance of Registration is required');
    if (serviceRegistration == null)
      throw Error('an instance of ServiceRegistry is required');

    if (this.INSTANCE == null) {
      Logger.log(
        `initializing ServiceRegistryFactory factory.`,
        'ServiceRegistryFactory'
      );
      this.INSTANCE = new ServiceRegistryFactory(
        registration,
        serviceRegistration
      );
    }

    return this.INSTANCE;
  }
}
