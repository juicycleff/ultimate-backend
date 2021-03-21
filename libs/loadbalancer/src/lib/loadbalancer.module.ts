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
 * File name:         loadbalancer.module.ts
 * Last modified:     07/03/2021, 18:09
 ******************************************************************************/
import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { LoadBalancerClient } from './loadbalance.client';
import {
  LoadBalancerModuleAsyncOptions,
  LoadBalancerModuleOptions,
  LoadBalancerModuleOptionsFactory,
} from './loadbalancer-module.options';
import {
  LOAD_BALANCE_CONFIG_OPTIONS,
  LOAD_BALANCE_MODULE_OPTIONS,
} from './loadbalancer.constant';
import {
  RandomStrategy,
  RoundRobinStrategy,
  WeightedRoundRobinStrategy,
} from './strategy';
import { WeightedRandomStrategy } from './strategy/weighted-random.strategy';
import { DiscoveryModule } from '@nestjs/core';
import { StrategyDiscovery } from './strategy.discovery';
import { StrategyRegistry } from './strategy.registry';
import { LoadbalancerConfig } from './loadbalancer.config';
import { Scanner } from '@ultimate-backend/common';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [Scanner],
})
export class LoadBalancerModule {
  static forRoot(options?: LoadBalancerModuleOptions): DynamicModule {
    return {
      module: LoadBalancerModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: LOAD_BALANCE_CONFIG_OPTIONS,
          useValue: new LoadbalancerConfig(options),
        },
        StrategyDiscovery,
        RoundRobinStrategy,
        RandomStrategy,
        WeightedRoundRobinStrategy,
        WeightedRandomStrategy,
        ...(options?.customStrategies || []),
        LoadBalancerClient,
        StrategyRegistry,
      ],
      exports: [LoadBalancerClient],
      global: true,
    };
  }

  static forRootAsync(options: LoadBalancerModuleAsyncOptions): DynamicModule {
    let customStrategies = [];

    const configProvider: Provider = {
      provide: LOAD_BALANCE_CONFIG_OPTIONS,
      useFactory: async (modOptions: LoadBalancerModuleOptions) => {
        customStrategies = modOptions.customStrategies;
        return new LoadbalancerConfig(modOptions || { strategy: 'RoundRobin' });
      },
      inject: [LOAD_BALANCE_CONFIG_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: LoadBalancerModule,
      imports: [DiscoveryModule],
      providers: [
        ...asyncProviders,
        configProvider,
        StrategyDiscovery,
        RoundRobinStrategy,
        RandomStrategy,
        WeightedRoundRobinStrategy,
        WeightedRandomStrategy,
        ...(customStrategies || []),
        LoadBalancerClient,
        StrategyRegistry,
      ],
      exports: [LoadBalancerClient],
      global: true,
    };
  }

  private static createAsyncProviders(
    options: LoadBalancerModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProviders(options)];
    }

    const useClass = options.useExisting as Type<LoadBalancerModuleOptionsFactory>;

    return [
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProviders(
    options: LoadBalancerModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        useFactory: options.useFactory,
        inject: options.inject,
        provide: LOAD_BALANCE_MODULE_OPTIONS,
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<LoadBalancerModuleOptionsFactory>,
    ];

    return {
      provide: LOAD_BALANCE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: LoadBalancerModuleOptionsFactory) =>
        await optionsFactory.createLoaderBalancerOptions(),
      inject,
    };
  }
}
