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
 * File name:         bootstrap.orchestrator.ts
 * Last modified:     26/03/2021, 14:47
 ******************************************************************************/
import { Injectable } from '@nestjs/common';
import { BootstrapValueMetadata } from './interface';
import { BootstrapStore } from './bootstrap.store';

interface BootstrapValue {
  name: string;
  property: string;
  target: Function;
  defaults: any;
}

@Injectable()
export class BootstrapOrchestrator {
  private readonly bootValues = new Map<string, BootstrapValue>();

  constructor(private readonly store: BootstrapStore) {}

  addConfigValues(target: Function, configValues: BootstrapValueMetadata[]) {
    configValues.forEach(({ name, defaults, property }) => {
      const key = `${name}__${property}__${target.constructor.name}`;
      this.bootValues.set(key, { name, property, target, defaults });
    });
  }

  async mountConfigValues() {
    for (const item of this.bootValues.values()) {
      const { name, property, target, defaults } = item;
      const path = name || property;

      this.store.watch(
        path,
        (value) => {
          if (value !== void 0) {
            target[property] = value;
          } else if (defaults !== void 0) {
            target[property] = value;
          }
        },
        defaults
      );
      const value = this.store.get(path, defaults);
      if (value !== void 0) {
        target[property] = value;
      }
    }
  }
}
