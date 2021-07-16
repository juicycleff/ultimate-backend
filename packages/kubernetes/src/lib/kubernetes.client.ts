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
 * File name:         kubernetes.client.ts
 * Last modified:     24/06/2021, 01:01
 ******************************************************************************/
import * as k8s from '@kubernetes/client-node';
import { handleRetry, IReactiveClient } from '@ultimate-backend/common';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { defer } from 'rxjs';
import { KubernetesConfig } from './kubernetes.config';

@Injectable()
export class KubernetesClient
  implements IReactiveClient<k8s.KubeConfig>, OnModuleInit {
  private logger = new Logger(KubernetesClient.name);

  _kc: k8s.KubeConfig;
  _client: k8s.CoreV1Api;
  _watcher: k8s.Watch;

  constructor(private readonly opts: KubernetesConfig) {}

  close(): void | Promise<void> {
    return undefined;
  }

  get watcher(): k8s.Watch {
    if (!this._watcher) {
      throw new Error('Kubernetes watcher is not initialized');
    }

    return this._watcher;
  }

  get client(): k8s.CoreV1Api {
    if (!this._watcher) {
      throw new Error('Kubernetes client is not initialized');
    }

    return this._client;
  }

  get kc(): k8s.KubeConfig {
    if (!this._kc) {
      this.connect();
      throw new Error('Kubernetes is not initialized');
    }

    return this._kc;
  }

  async connect(): Promise<any> {
    try {
      return await defer(() => {
        this.logger.log('KubernetesClient client started');
        this._kc = new k8s.KubeConfig();

        if (this.opts.config.k8sOptions) {
          this._kc.loadFromOptions({
            clusters: this.opts.config.k8sOptions.clusters,
            users: this.opts.config.k8sOptions.users,
            contexts: this.opts.config.k8sOptions.contexts,
            currentContext: this.opts.config.k8sOptions.currentContext,
          });
        } else {
          this._kc.loadFromDefault();
        }

        this._client = this._kc.makeApiClient(k8s.CoreV1Api);
        this._watcher = new k8s.Watch(this._kc);
        this.logger.log('KubernetesClient client connected successfully');
      })
        .pipe(
          handleRetry(
            this.opts.config.retryAttempts,
            this.opts.config.retryDelays,
            KubernetesClient.name
          )
        )
        .toPromise();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }
}
