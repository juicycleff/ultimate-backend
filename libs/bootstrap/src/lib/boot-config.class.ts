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
 * File name:         app-setup-config.class.ts
 * Last modified:     26/03/2021, 14:08
 ******************************************************************************/
import { Injectable } from '@nestjs/common';
import { BootstrapStore } from './bootstrap.store';
import { BootConfigSourceLoader } from './boot-config-source.loader';

@Injectable()
export class BootConfig {
  constructor(
    private readonly options: BootstrapStore,
    private readonly sourceLoader: BootConfigSourceLoader,
    private readonly store: BootstrapStore
  ) {
    this.store.cache = this.sourceLoader.load();
  }

  get<T extends any>(path?: string, defaults?: T): T {
    return this.store.get<T>(path, defaults);
  }
}
