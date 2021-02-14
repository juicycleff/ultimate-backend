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
 * File name:         config-etcd.store.ts
 * Last modified:     08/02/2021, 00:17
 ******************************************************************************/

/**
 * This is a client implementation of config for ETCD
 * @packageDocumentation
 */

import {
  ConfigModuleOptions,
  Configurations,
  IConfigStore,
} from '../interfaces';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EtcdService } from '@ultimate-backend/etcd';
import { LoggerUtil } from '@ultimate-backend/common';
import { ConfigSetException } from '../exceptions';
import * as YAML from 'yaml';
import { ConfigGlobalStore } from './config-global.store';
import { CONFIG_MODULE_OPTIONS } from '../config.constant';
import { ConfigSource } from '../config.enum';
import * as RPC from 'etcd3/lib/rpc';

@Injectable()
export class ConfigEtcdStore implements IConfigStore, OnModuleInit {
  private readonly logger = new LoggerUtil('ConfigEtcdStore');
  private defaultNamespace: string;

  constructor(
    private readonly etcdService: EtcdService,
    private readonly store: ConfigGlobalStore,
    @Inject(CONFIG_MODULE_OPTIONS)
    private readonly options: ConfigModuleOptions
  ) {
    this.logger = new LoggerUtil('ConfigEtcdStore', options.debug);
    this.defaultNamespace = options.namespace ?? 'ub-config/';
  }

  onModuleInit(): any {
    // TODO: Fix soon
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
   * const config = ConfigEtcdStore(...);
   * config.get<string>('name.firstname', 'Johny);
   * ```
   */
  get<T extends any>(path: string, defaultValue: T): Promise<T> | T | undefined;
  get<T extends any>(path: string): Promise<T> | T | undefined;

  get<T extends any>(path: string, defaultValue?): Promise<T> | T | undefined {
    return undefined;
  }

  async set(path: string, value: any): Promise<void> {
    try {
      const yamlString = YAML.stringify(this.store.data);
      await this.etcdService
        .namespace(this.defaultNamespace)
        .put(path)
        .value(yamlString);
    } catch (e) {
      throw new ConfigSetException(e.message);
    }
  }

  async createWatcher(configs: Configurations | Array<Configurations>) {
    if (Array.isArray(configs)) {
      for (const c of configs) {
        await this.createWatcher(c);
      }
    } else {
      if (configs.source === ConfigSource.Etcd) {
        const watcher = await this.etcdService
          .namespace(this.defaultNamespace)
          .watch()
          .key(configs.key)
          .create();

        watcher.on('data', (res: RPC.IWatchResponse) => {
          const event = res.events.filter((e) => !e.prev_kv)[0];
          if (!event) {
            return;
          }

          if (event.type === 'Delete') {
            // TODO: Reset store by key and source
          } else if (event.type === 'Put') {
            if (event.kv.value && event.kv.value.toString()) {
              try {
                // TODO: Reset store by key and source
              } catch (e) {
                this.logger.error('Ca', e);
              }
            } else {
              // TODO: Reset store by key and source
            }
          }
        });
      }
    }
  }

  watch<T extends any>(paths: string): void {
    // TODO: Fix soon
  }
}
