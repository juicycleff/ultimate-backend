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
 * File name:         strategy.registry.ts
 * Last modified:     19/03/2021, 12:34
 ******************************************************************************/
import { Injectable } from '@nestjs/common';
import { BaseStrategy, ServiceInstance } from '@ultimate-backend/common';

@Injectable()
export class StrategyRegistry {
  private readonly strategies = new Map<string, BaseStrategy<ServiceInstance>>();
  private readonly refs: Function[] = [];

  public addStrategy(name: string, strategy: BaseStrategy<ServiceInstance>) {
    if (!this.strategies.has(name)) {
      this.strategies.set(name, strategy);
      this.refs.forEach(ref => ref());
    }
  }

  public getStrategy(name: string): BaseStrategy<ServiceInstance> | undefined {
    return this.strategies.get(name);
  }

  public watch(ref: () => void) {
    this.refs.push(ref);
  }
}
