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
 * File name:         bootstrap.store.ts
 * Last modified:     26/03/2021, 13:48
 ******************************************************************************/
import { compile } from 'handlebars';
import {
  get,
  isString,
  isArray,
  isObject,
  assign,
  set,
  isPlainObject,
} from 'lodash';
import { EventEmitter } from 'events';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BootstrapStore extends EventEmitter {
  private _cache: Object = {};
  private eventName = 'changed';

  get cache() {
    return this._cache;
  }

  set cache(data: any) {
    this._cache = data;
    if (isObject(this._cache)) {
      for (const key in this._cache) {
        // eslint-disable-next-line no-prototype-builtins
        if (this._cache.hasOwnProperty(key)) {
          this.transformEnv(key, this._cache, this._cache[key]);
        }
      }
    }
    this.updateConfigMap();
  }

  get<T extends any>(path: string, defaults?: T): T {
    return get(this._cache, path, defaults);
  }

  update<T extends any>(path: string, value: T) {
    set(this._cache, path, value);
    this.updateConfigMap();
  }

  merge(data: any) {
    if (isPlainObject(data)) {
      assign(this._cache, data);
      this.emit(this.eventName, this._cache);
    }
  }

  watch(path: string, callback: (value: any) => void, defaultValue?: any) {
    this.on(this.eventName, () => {
      callback(this.get(path, defaultValue));
    });
  }

  private transformEnv(key: string | number, parent: any, config: any) {
    if (isString(config)) {
      const template = compile(config.replace(/\${{/g, '{{'));
      parent[key] = template({ ...this._cache });
    } else if (isArray(config)) {
      config.forEach((item, index) => this.transformEnv(index, config, item));
    } else if (isObject(config)) {
      for (const key in config) {
        // eslint-disable-next-line no-prototype-builtins
        if (config.hasOwnProperty(key)) {
          this.transformEnv(key, config, config[key]);
        }
      }
    }
  }

  private updateConfigMap() {
    this.emit(this.eventName, this._cache);
  }
}
