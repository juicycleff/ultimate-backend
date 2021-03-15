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
 * File name:         config-consul.source.ts
 * Last modified:     07/02/2021, 11:30
 ******************************************************************************/

import { ConsulConfigOptions, IConfigSource } from '../interfaces';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { consul, ConsulService } from '@ultimate-backend/consul';
import { ConfigOptions } from '../config-options';
import { ConfigStore } from '../config.store';
import { ConfigSource } from '../config.enum';
import { objectToStringFormat, stringToObjectType } from '../utils';
import { InjectConfigOptions } from '../decorators/inject-config.decorator';
import { LoggerUtil } from '@ultimate-backend/common';
import { ConfigSetException } from '../exceptions';

interface KVResult {
  LockIndex: number;
  Key: string;
  Flags: number;
  Value: string;
  CreateIndex: number;
  ModifyIndex: number;
}

/**
 * This is a config source for Consul
 * @packageDocumentation
 */
@Injectable()
export class ConfigConsulSource implements IConfigSource, OnModuleInit {
  private watchers: Map<string, consul.Watch> = new Map();
  private readonly logger = new LoggerUtil(ConfigConsulSource.name);

  constructor(
    private readonly client: ConsulService,
    @InjectConfigOptions()
    private readonly options: ConfigOptions,
    private readonly store: ConfigStore
  ) {
    this.logger = new LoggerUtil(ConfigConsulSource.name, options.config.debug);
  }

  onModuleInit(): any {
    this.watchAllConfigs();
  }

  get<T extends any>(path: string, defaultValue: T): Promise<T> | T | undefined;
  get<T extends any>(path: string): Promise<T> | T | undefined;

  get<T extends any>(path: string, defaultValue?): Promise<T> | T | undefined {
    if (!path) {
      return this.store.cache;
    }

    return this.store.get(path, defaultValue);
  }

  async set(
    path: string,
    value: string,
    _forceUpdate?: boolean
  ): Promise<void> {
    try {
      const result = await this.client.consul.kv.get<string>(path);
      if (result) {
        const payStr = objectToStringFormat(result, value);
        await this.client.consul.kv.set<string>(path, payStr);
      }
    } catch (e) {
      throw new ConfigSetException(e.message);
    }
  }

  watch<T extends any>(path: string, callback: (value: T) => void): void {
    const watcher = this.client.consul.watch({
      method: this.client.consul.kv.get,
      options: {
        key: path,
        wait: '5m',
      },
    });

    watcher.on('change', (data: KVResult) => {
      const parsedData = stringToObjectType(data.Value);
      callback(parsedData);
    });
  }

  private watchAllConfigs() {
    if (!this.client.consul) {
      return;
    }

    const loads: ConsulConfigOptions[] = [];

    if (!Array.isArray(this.options.config.load)) {
      if (this.options.config.load.source === ConfigSource.Consul) {
        loads.push(this.options.config.load);
      }
    } else {
      const _consulLoads = this.options.config.load.filter(
        (value) => value.source === ConfigSource.Consul
      ) as ConsulConfigOptions[];
      loads.push(..._consulLoads);
    }

    for (const load of loads) {
      const key = load.prefix ? `${load.prefix}${load.key}` : load.key;

      if (this.watchers[key]) {
        this.watchers[key].end();
      }

      this.watchers[key] = this.client.consul.watch({
        method: this.client.consul.kv.get,
        options: {
          key,
          wait: '5m',
        },
      });

      const watcher = this.watchers[key];
      watcher.on('change', (data: KVResult) => {
        const parsedData = stringToObjectType(data.Value);
        this.store.merge(parsedData);
      });
      watcher.on('error', () => {
        this.logger.error(`error on key: [${key}]`);
      });
    }
  }
}
