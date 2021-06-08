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
 * File name:         zookeeper-module.options.ts
 * Last modified:     08/02/2021, 11:17
 ******************************************************************************/

import { ClassProvider, ModuleMetadata, Type } from '@nestjs/common';
import { LoadBalancerProperties } from './config';
import { LoadBalanceStrategy } from './strategy.option';
import { BaseStrategy, ServiceInstance } from '@ultimate-backend/common';

export interface LoadBalancerModuleOptions {
  strategy?: LoadBalanceStrategy;
  services?: { name: string; strategy: string }[];
  customStrategies?: ClassProvider<BaseStrategy<ServiceInstance>>[];
  options?: LoadBalancerProperties;
}

export interface LoadBalancerModuleOptionsFactory {
  createLoaderBalancerOptions():
    | Promise<LoadBalancerModuleOptions>
    | LoadBalancerModuleOptions;
}

/**
 * Options available when creating the module asynchronously. You should use only one of the
 * useExisting, useClass, or useFactory options for creation.
 */
export interface LoadBalancerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /** Reuse an injectable factory class created in another module. */
  useExisting?: Type<LoadBalancerModuleOptionsFactory>;

  /**
   * Use an injectable factory class to populate the module options, such as URI and database name.
   */
  useClass?: Type<LoadBalancerModuleOptionsFactory>;

  /**
   * A factory function that will populate the module options, such as URI and database name.
   */
  useFactory?: (
    ...args: never[]
  ) => Promise<LoadBalancerModuleOptions> | LoadBalancerModuleOptions;

  /**
   * Inject any dependencies required by the module, such as a configuration service
   */
  inject?: never[];
}
