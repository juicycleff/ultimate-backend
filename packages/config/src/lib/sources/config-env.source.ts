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
 * File name:         config-env.source.ts
 * Last modified:     07/02/2021, 11:27
 ******************************************************************************/

import { EnvConfigOptions } from '../interfaces';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { isPlainObject } from 'lodash';
import {
  ConfigSource,
  IConfigSource,
  IConfigStore,
  InjectConfigModuleOptions,
  InjectConfigStore,
  LoggerUtil,
} from '@ultimate-backend/common';
import { readEnv } from 'read-env';

@Injectable()
export class ConfigEnvSource implements IConfigSource, OnModuleInit {
  private watchers: Map<string, any> = new Map();
  private logger = new LoggerUtil(ConfigEnvSource.name);

  constructor(
    @InjectConfigModuleOptions() private readonly options: any,
    @InjectConfigStore() private readonly store: IConfigStore<any>
  ) {}

  async onModuleInit() {
    this.logger = new LoggerUtil(
      ConfigEnvSource.name,
      this.options.config.debug
    );
    await this.buildConfigs();
  }

  get<T extends any>(path: string, defaultValue: T): Promise<T> | T | undefined;
  get<T extends any>(path: string): Promise<T> | T | undefined;
  get<T extends any>(path: string, defaultValue?): Promise<T> | T | undefined {
    if (!path) {
      return this.store.cache;
    }

    return this.store.get(path, defaultValue);
  }

  set(path: string, value: string): Promise<void> {
    throw new Error('set not supported for env source type');
  }

  watch<T extends any>(_path: string, _callback: (value: T) => void): void {
    throw new Error('watch not supported for env source type');
  }

  private async buildConfigs() {
    const loads: EnvConfigOptions[] = [];

    if (!Array.isArray(this.options.config.load)) {
      if (this.options.config.load.source === ConfigSource.Env) {
        loads.push(this.options.config.load);
      }
    } else {
      const _fileLoads = this.options.config.load.filter(
        (value) => value.source === ConfigSource.Env
      ) as EnvConfigOptions[];
      loads.push(..._fileLoads);
    }

    const shouldSkip = loads.find((value) => value.ignoreEnvFile === true);

    if (shouldSkip) {
      try {
        const result = readEnv(shouldSkip.prefix, { separator: '_' });
        if (isPlainObject(result)) {
          this.store.merge(result);
        }
      } catch (e) {
        this.logger.error(e);
      }
      return;
    }

    for (const load of loads) {
      const path = load.envFilePath;

      if (this.watchers[path]) {
        this.watchers[path].close();
      }

      try {
        dotenv.config({ path });
        const result = readEnv(load.prefix, { separator: '_' });
        if (isPlainObject(result)) {
          this.store.merge(result);
        }
      } catch (e) {
        this.logger.error(e);
      }
    }
  }
}
