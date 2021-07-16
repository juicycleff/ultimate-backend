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
 * File name:         config.orchestrator.ts
 * Last modified:     14/03/2021, 21:11
 ******************************************************************************/
import { Inject, Injectable } from '@nestjs/common';
import { ConfigStore } from './config.store';
import { ConfigValueMetadata } from './interfaces/config-metadata.interface';
import { CONFIG_STORE_SHARED } from '@ultimate-backend/common';

interface ConfigValue {
  name: string;
  property: string;
  target: Function;
  defaults: any;
}

@Injectable()
export class ConfigOrchestrator {
  private readonly configValues = new Map<string, ConfigValue>();

  constructor(@Inject(CONFIG_STORE_SHARED) private readonly store: ConfigStore) {}

  addConfigValues(target: Function, configValues: ConfigValueMetadata[]) {
    configValues.forEach(({ name, defaults, property }) => {
      const key = `${name}__${property}__${target.constructor.name}`;
      this.configValues.set(key, { name, property, target, defaults });
    });
  }

  async mountConfigValues() {
    for (const item of this.configValues.values()) {
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
