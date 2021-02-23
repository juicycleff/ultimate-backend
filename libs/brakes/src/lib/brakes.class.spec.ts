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

import { Test } from '@nestjs/testing';
import { Brakes } from './brakes.class';
import { BrakesModuleOptions } from './brakes-module.options';
import { BRAKES_CONFIG_OPTIONS } from './brakes.constants';
import { BrakesResolver } from './brakes.resolver';
import { BrakesFactory } from './brakes.factory';

describe('BrakesClass', () => {
  let service: Brakes;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: BRAKES_CONFIG_OPTIONS,
          useValue: {
            allowWarmUp: true,
          } as BrakesModuleOptions,
        },
        BrakesResolver,
        BrakesFactory,
        Brakes,
      ],
    }).compile();

    service = module.get(Brakes);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('should be succesfull', async () => {
    const delay = (delay) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, delay);
      });

    const fire = service.prepare('delay', delay);
    await fire(200, 1, 2, 3);

    expect(service).toBeTruthy();
  });
});
