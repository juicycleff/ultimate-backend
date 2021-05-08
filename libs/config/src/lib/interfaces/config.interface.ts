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
 * File name:         config.interface.ts
 * Last modified:     07/02/2021, 13:00
 ******************************************************************************/

import { ConfigSource } from '../config.enum';

export interface IConfigSource {
  watch<T extends any>(path: string, callback: (value: any) => void): void;

  /**
   * Get a configuration by  key path. It will return default value if path is missing
   * @param path
   * @param defaultValue
   */
  get<T extends any>(path: string, defaultValue: T): T | Promise<T> | undefined;

  /**
   * Get a configuration by  key path.
   * @param path
   */
  get<T extends any>(path: string): T | Promise<T> | undefined;

  /**
   * Set config value by key path
   * @param path
   * @param value
   * @param forceUpdate
   */
  set(path: string, value: any, forceUpdate?: boolean): Promise<void>;
}

export interface ConfigData {
  source: ConfigSource;
  data: Map<string, any>;
}
