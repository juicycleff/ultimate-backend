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
 * File name:         loadbalancer.config.ts
 * Last modified:     19/03/2021, 12:08
 ******************************************************************************/
import { LoadBalancerModuleOptions } from '@ultimate-backend/loadbalancer';
import { OnModuleInit } from '@nestjs/common';

export class LoadbalancerConfig implements OnModuleInit {
  private options: LoadBalancerModuleOptions;
  private CONFIG_PREFIX = 'loadbalance';

  constructor(private readonly opts: LoadBalancerModuleOptions) {}

  get config(): LoadBalancerModuleOptions {
    return this.options;
  }

  public getServicesOption() {
    return this.options?.services || [];
  }

  public getGlobalStrategy() {
    return this.options?.strategy || 'RandomStrategy';
  }

  public getStrategy(serviceName: string) {
    const serviceOptions = this.getServicesOption();
    const serviceOption = serviceOptions.filter((item) => {
      return item.name === serviceName;
    })[0];

    if (!serviceOption) {
      return this.getGlobalStrategy();
    }
    return serviceOption.strategy;
  }

  onModuleInit(): any {
    if (this.opts) {
      this.options = Object.assign(this.opts, this.options);
    }
  }
}
