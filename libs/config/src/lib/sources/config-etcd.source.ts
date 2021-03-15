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
 * File name:         config-etcd.source.ts
 * Last modified:     08/02/2021, 00:17
 ******************************************************************************/
import { EtcdConfigOptions, IConfigSource } from '../interfaces';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EtcdClient, etcd3, IWatchResponse } from '@ultimate-backend/etcd';
import { LoggerUtil } from '@ultimate-backend/common';
import { ConfigSetException } from '../exceptions';
import { ConfigSource } from '../config.enum';
import { ConfigStore } from '../config.store';
import { InjectConfigOptions } from '../decorators/inject-config.decorator';
import { ConfigOptions } from '../config-options';
import { objectToStringFormat, stringToObjectType } from '../utils';

/**
 * This is a client implementation of config for ETCD
 * @packageDocumentation
 */
@Injectable()
export class ConfigEtcdSource implements IConfigSource, OnModuleInit {
  private watchers: Map<string, etcd3.Watcher> = new Map();
  private readonly logger = new LoggerUtil(ConfigEtcdSource.name);
  private defaultNamespace: string;

  constructor(
    private readonly etcd: EtcdClient,
    @InjectConfigOptions()
    private readonly options: ConfigOptions,
    private readonly store: ConfigStore
  ) {
    this.logger = new LoggerUtil(ConfigEtcdSource.name, options.config.debug);
    this.defaultNamespace = options.config.namespace;
  }

  async onModuleInit() {
    await this.watchAllConfigs();
  }

  /**
   * get config by path. Supports dot notation for example (name.firstname)
   * @param path
   * @param defaultValue
   * @typeParam T Return type `T`
   * @return T It returns a `Promise<T>` or just `T`
   *
   * @example
   * ```typescript
   * const config = ConfigEtcdSource(...);
   * config.get<string>('name.firstname', 'Johny);
   * ```
   */
  get<T extends any>(path: string, defaultValue: T): Promise<T> | T | undefined;
  get<T extends any>(path: string): Promise<T> | T | undefined;
  get<T extends any>(path: string, defaultValue?): Promise<T> | T | undefined {
    if (!path) {
      return this.store.cache;
    }

    return this.store.get(path, defaultValue);
  }

  async set(path: string, value: any): Promise<void> {
    try {
      const result = await this.etcd
        .namespace(this.defaultNamespace || '')
        .get(path);

      if (result) {
        const payStr = objectToStringFormat(result, value);
        await this.etcd
          .namespace(this.defaultNamespace || '')
          .put(path)
          .value(payStr);
      }
    } catch (e) {
      throw new ConfigSetException(e.message);
    }
  }

  private async watchAllConfigs() {
    const loads: EtcdConfigOptions[] = [];

    if (!Array.isArray(this.options.config.load)) {
      if (this.options.config.load.source === ConfigSource.Etcd) {
        loads.push(this.options.config.load);
      }
    } else {
      const _etcdLoads = this.options.config.load.filter(
        (value) => value.source === ConfigSource.Etcd
      ) as EtcdConfigOptions[];
      loads.push(..._etcdLoads);
    }

    for (const load of loads) {
      const key = load.key;

      if (this.watchers[key]) {
        this.watchers[key].end();
      }

      try {
        let curConfig = await this.etcd
          .namespace(load.namespace || this.defaultNamespace || '')
          .get(key);

        curConfig = stringToObjectType(curConfig);
        if (curConfig) {
          this.store.merge(curConfig);
        }
      } catch (e) {
        // ignore
      }

      this.watchers[key] = await this.etcd
        .namespace(load.namespace || this.defaultNamespace || '')
        .watch()
        .key(load.key)
        .create();

      const watcher = this.watchers[key];
      watcher.on('data', (res: IWatchResponse) => {
        const event = res.events.filter((e) => !e.prev_kv)[0];
        if (!event) {
          return;
        }

        if (event.type === 'Delete') {
          // TODO: Reset store by key and source
        } else if (event.type === 'Put') {
          if (event.kv.value && event.kv.value.toString()) {
            try {
              const parsedData = stringToObjectType(event.kv.value.toString());
              if (parsedData) {
                console.log(parsedData);
                this.store.merge(parsedData);
              }
            } catch (e) {
              this.logger.error(e);
            }
          } else {
            this.logger.error(`invalid value format for path: [${key}]`);
          }
        }
      });
    }
  }

  async watch<T extends any>(path: string, callback: (value: T) => void) {
    const watcher = await this.etcd
      .namespace(this.defaultNamespace || '')
      .watch()
      .key(path)
      .create();

    watcher.on('data', (res: IWatchResponse) => {
      console.log(res);
      const event = res.events.filter((e) => !e.prev_kv)[0];
      if (!event) {
        return;
      }

      if (event.type === 'Delete') {
        // TODO: Reset store by key and source
      } else if (event.type === 'Put') {
        if (event.kv.value && event.kv.value.toString()) {
          try {
            const parsedData = stringToObjectType(event.kv.value.toString());
            callback(parsedData);
          } catch (e) {
            this.logger.error(e);
          }
        } else {
          this.logger.error(`invalid value format for path: [${path}]`);
        }
      }
    });
  }
}
