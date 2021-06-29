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
 * File name:         config-zookeeper.source.ts
 * Last modified:     07/02/2021, 11:31
 ******************************************************************************/
import { Injectable, OnModuleInit } from '@nestjs/common';
import { isPlainObject } from 'lodash';
import {
  BaseConfigOptions,
  ConfigSetException,
  ConfigSource,
  IConfigSource,
  IConfigStore,
  InjectConfigModuleOptions,
  InjectConfigStore,
  LoggerUtil,
  objectToStringFormat,
  stringToObjectType,
} from '@ultimate-backend/common';
import { ZookeeperClient, Zookeeper } from '../../';

export interface ZookeeperConfigOptions extends BaseConfigOptions {
  source: ConfigSource.Zookeeper;
  prefix?: string;
  key: string;
}

@Injectable()
export class ConfigZookeeperSource implements IConfigSource, OnModuleInit {
  private watchers: Map<string, any> = new Map();
  private logger = new LoggerUtil(ConfigZookeeperSource.name);
  private defaultNamespace: string;

  constructor(
    private readonly zookeeper: ZookeeperClient,
    @InjectConfigModuleOptions() private readonly options: any,
    @InjectConfigStore() private readonly store: IConfigStore<any>
  ) {
    this.storeUpdate.bind(this);
  }

  async onModuleInit() {
    this.logger = new LoggerUtil(
      ConfigZookeeperSource.name,
      this.options.config.debug
    );
    this.defaultNamespace = this.options.config.namespace;

    this.zookeeper.once('connect', async () => {
      await this.watchAllConfigs();
    });
    await this.watchAllConfigs();
  }

  get<T extends any>(path: string, defaultValue: T): Promise<T> | T | undefined;
  get<T extends any>(path: string): Promise<T> | T | undefined;
  get<T extends any>(path: string, defaultValue?): Promise<T> | T | undefined {
    if (!path) {
      return this.store.cache;
    }

    return this.store.get(path, defaultValue);
  }

  async set(path: string, value: string): Promise<void> {
    try {
      const result = await this.zookeeper.get(path, false);
      if (result) {
        const payStr = objectToStringFormat(result.toString(), value);
        await this.zookeeper.create(path, payStr, Zookeeper.ZOO_EPHEMERAL);
      }
    } catch (e) {
      throw new ConfigSetException(e.message);
    }
  }

  async watch<T extends any>(path: string, callback: (value: T) => void) {
    try {
      await this.zookeeper.w_get(path, async (type, stat, path) => {
        const [, data] = await this.zookeeper.get(path, false);
        const parsedData = stringToObjectType(data.toString());
        if (isPlainObject(parsedData)) {
          callback(parsedData);
        }
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async watchAllConfigs() {
    try {
      if (!this.zookeeper.connected) {
        return;
      }

      const loads: ZookeeperConfigOptions[] = [];

      if (!Array.isArray(this.options.config.load)) {
        if (this.options.config.load.source === ConfigSource.Zookeeper) {
          loads.push(this.options.config.load);
        }
      } else {
        const _zookeeperLoads = this.options.config.load.filter(
          (value) => value.source === ConfigSource.Zookeeper
        ) as ZookeeperConfigOptions[];
        loads.push(..._zookeeperLoads);
      }

      for (const load of loads) {
        const key = load.prefix ? `${load.prefix}${load.key}` : load.key;

        if (this.watchers[key]) {
          // figure out how to close watch
        }

        const callback = this.storeUpdate;
        this.setWatch(key, callback);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  private storeUpdate(
    data: string | Buffer,
    store: IConfigStore<any>,
    logger: LoggerUtil
  ) {
    try {
      const parsedData = stringToObjectType(data.toString());
      if (isPlainObject(parsedData)) {
        store.merge(parsedData);
      }
    } catch (e) {
      logger.error(e);
    }
  }

  private setWatch(key: string, callback: Function): void {
    this.watchers[key] = this.zookeeper.w_get(key, async (rc, error, stat) => {
      const [, data] = await this.zookeeper.get(key, false);
      this.setWatch(key, callback);
      callback(data, this.store, this.logger);
    });
  }
}
