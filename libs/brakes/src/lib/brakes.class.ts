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
 * File name:         brakes.class.ts
 * Last modified:     19/02/2021, 21:22
 ******************************************************************************/

import { Injectable } from '@nestjs/common';
import { BrakesFactory } from './brakes.factory';
import * as CircuitBreaker from 'opossum';
import { BrakesResolver } from './brakes.resolver';

@Injectable()
export class Brakes {
  constructor(
    private readonly brakesFactory: BrakesFactory,
    private readonly brakesResolver: BrakesResolver,
  ) {}

  prepare(name: string, action: Function, fallback: ((...args: any[]) => any) | CircuitBreaker): Function;
  prepare(action: Function, fallback: ((...args: any[]) => any) | CircuitBreaker): Function;
  prepare(name: string, action: Function): Function;
  prepare(
    nameOrAction: string | Function,
    actionOrFallback: ((...args: any[]) => any) | CircuitBreaker | Function,
    fall?: ((...args: any[]) => any) | CircuitBreaker): Function {

    const [name, action, fallback] =
      typeof nameOrAction === 'string' && fall ?
        [nameOrAction as string, actionOrFallback as (...args: any) => Promise<any>, fall as ((...args: any[]) => any) | CircuitBreaker] :
        typeof nameOrAction === 'string' && !fall ?
          [nameOrAction, actionOrFallback as (...args: any) => Promise<any>, undefined] :
          [undefined, nameOrAction as (...args: any) => Promise<any>, actionOrFallback as ((...args: any[]) => any) | CircuitBreaker];

    let brake = this.brakesResolver.getBrakes(name);
    if (!brake) {
      brake = this.brakesFactory.createBrake(name, action);
    }

    if (fallback) {
      brake.fallback(fallback);
    }

    return brake.fire.bind(brake);
  }
}
