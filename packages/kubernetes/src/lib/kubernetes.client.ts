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

  kc: k8s.KubeConfig;
  client: k8s.CoreV1Api;
  watcher: k8s.Watch;

  constructor(private readonly opts: KubernetesConfig) {}

  close(): void | Promise<void> {
    return undefined;
  }

  async connect(): Promise<any> {
    try {
      return await defer(() => {
        this.logger.log('KubernetesClient client started');
        this.kc = new k8s.KubeConfig();

        if (this.opts.config.k8sOptions) {
          this.kc.loadFromOptions({
            clusters: this.opts.config.k8sOptions.clusters,
            users: this.opts.config.k8sOptions.users,
            contexts: this.opts.config.k8sOptions.contexts,
            currentContext: this.opts.config.k8sOptions.currentContext,
          });
        } else {
          this.kc.loadFromDefault();
        }

        this.client = this.kc.makeApiClient(k8s.CoreV1Api);
        this.watcher = new k8s.Watch(this.kc);
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
