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
 * File name:         strategy-instance-list.builder.ts
 * Last modified:     09/03/2021, 13:18
 ******************************************************************************/
import { LoggerUtil } from '@ultimate-backend/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

@Injectable()
export class StrategyInstanceListBuilder implements OnModuleInit {
  private logger = new LoggerUtil(StrategyInstanceListBuilder.name, true);

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector
  ) {}

  explore() {
    const providers: InstanceWrapper[] = [
      ...this.discoveryService.getProviders(),
      ...this.discoveryService.getControllers(),
    ];

    for (const wrapper of providers) {
      const { instance } = wrapper;
      if (!instance || typeof instance === 'string') {
        return;
      }

      this.lookupStrategy(instance);
    }
  }

  lookupStrategy(instance: Function) {
    // console.log(instance);
  }

  onModuleInit(): any {
    this.explore();
  }
}
