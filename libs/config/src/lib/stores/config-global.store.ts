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
 * File name:         config-global.store.ts
 * Last modified:     07/02/2021, 20:41
 ******************************************************************************/

import { Injectable } from '@nestjs/common';
import { ConfigData } from '../interfaces';
import { ConfigSource } from '../config.enum';

@Injectable()
export class ConfigGlobalStore {
  private _dataArr: ConfigData[];

  /**
   * @param source
   * @param key
   * @param value
   *
  set(source: ConfigSource, key: string, value: any): void {
    /
  }

  /**
   * @description
   *
   * @param source
   * @param key
   */
  delete(source: ConfigSource, key: string): void {
    // TODO: Fix soon
  }

  get<T>(source: ConfigSource, key: string): T {
    // TODO: Fix soon
  }
}
