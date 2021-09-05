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
 * File name:         kubernetes-config.source.ts
 * Last modified:     28/03/2021, 17:35
 ******************************************************************************/
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as _ from 'lodash';
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
import * as k8s from '@kubernetes/client-node';
import { KubernetesClient } from '../kubernetes.client';

export interface KubernetesConfigOptions extends BaseConfigOptions {
  source: ConfigSource.Kubernetes;
  key: string;
  name: string;
  namespace?: string;
}

/**
 * This is a client implementation of config for ETCD
 * @packageDocumentation
 */
@Injectable()
export class KubernetesConfigSource implements IConfigSource, OnModuleInit {
  private watchers: Map<string, k8s.Watch> = new Map();
  private logger = new LoggerUtil(KubernetesConfigSource.name);
  private defaultNamespace: string;

  constructor(
    private readonly kubernetes: KubernetesClient,
    @InjectConfigModuleOptions() private readonly options: any,
    @InjectConfigStore() private readonly store: IConfigStore<any>
  ) {}

  async onModuleInit() {
    this.logger = new LoggerUtil(
      KubernetesConfigSource.name,
      this.options.config.debug
    );
    this.defaultNamespace = this.options.config.namespace || 'default';
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
   * const config = EtcdConfigSource(...);
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
      const result = await this.kubernetes.client.readNamespacedConfigMap(
        path,
        this.defaultNamespace || 'default'
      );
      const data = _.get(result, 'body.data', { [path]: '' });

      if (result) {
        const payStr = objectToStringFormat(data.toString(), value);
        await this.kubernetes.client.patchNamespacedConfigMap(
          path,
          this.defaultNamespace || 'default',
          payStr as any
        );
      }
    } catch (e) {
      throw new ConfigSetException(e.message);
    }
  }

  private async watchAllConfigs() {
    const loads: KubernetesConfigOptions[] = [];

    if (!Array.isArray(this.options.config.load)) {
      if (this.options.config.load.source === ConfigSource.Kubernetes) {
        loads.push(this.options.config.load);
      }
    } else {
      const _k8sLoads = this.options.config.load.filter(
        (value) => value.source === ConfigSource.Kubernetes
      ) as KubernetesConfigOptions[];
      loads.push(..._k8sLoads);
    }

    for (const load of loads) {
      const name = load.name;

      if (this.watchers[name]) {
        this.watchers[name].end();
      }

      try {
        const result = await this.kubernetes.client.readNamespacedConfigMap(
          name,
          load.namespace || this.defaultNamespace || 'default'
        );
        this.addToStore(result.body, load.key);
      } catch (e) {
        this.logger.error(e);
      }

      this.watchers[name] = await this.watchK8s(name, load.key, load.namespace ?? this.defaultNamespace, null);
    }
  }

  async watchK8s<T extends any>(
    name: string,
    key: string,
    namespace: string,
    callback: (value: T) => void
  ): Promise<k8s.Watch> {
    return this.kubernetes.watcher.watch(
      `/api/v1/watch/namespaces/${namespace}/configmaps/${name}`,
      {},
      (phase, watchObj) => {
        if (phase === 'ADDED' || phase === 'MODIFIED') {
          this.addToStore(watchObj, key, callback);
        }
      },
      (err) => {
        this.logger.error(err);
      }
    );
  }

  private addToStore(result: k8s.V1ConfigMap, key: string, callback?: (data: any) => void) {
    try {
      const curConfig = _.get(result, 'data', { [key]: '' });
      const parsedData = stringToObjectType(curConfig[key]);
      if (_.isPlainObject(parsedData)) {
        this.store.merge(parsedData);
      }
      if (callback) {
        callback(parsedData);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  async watch<T extends any>(
    name: string,
    callback: (value: T) => void
  ): Promise<k8s.Watch> {
    return this.watchK8s<T>(name, this.defaultNamespace, name, callback);
  }
}
