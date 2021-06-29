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
 * File name:         kubernetes-module.options.ts
 * Last modified:     24/06/2021, 01:08
 ******************************************************************************/

import { ModuleMetadata, Type } from '@nestjs/common';

interface ClusterConfig {
  name: string;
  server: string;
}

interface UserConfig {
  name: string;
  password: string;
}

interface ContextConfig {
  name: string;
  cluster: string;
  user: string;
}

export interface KubernetesClientOptions {
  currentContext: string;
  clusters: ClusterConfig[];
  users?: UserConfig[];
  contexts?: ContextConfig[];
}

export interface KubernetesModuleOptions {
  debug?: boolean;
  retryAttempts?: number;
  retryDelays?: number;
  global?: boolean;
  k8sOptions?: KubernetesClientOptions;
}

export interface KubernetesModuleOptionsFactory {
  createClientOptions():
    | Promise<KubernetesModuleOptions>
    | KubernetesModuleOptions;
}

/**
 * Options available when creating the module asynchronously. You should use only one of the
 * useExisting, useClass, or useFactory options for creation.
 */
export interface KubernetesModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /** Reuse an injectable factory class created in another module. */
  useExisting?: Type<KubernetesModuleOptionsFactory>;

  /**
   * Use an injectable factory class to populate the module options, such as URI and database name.
   */
  useClass?: Type<KubernetesModuleOptionsFactory>;

  /**
   * A factory function that will populate the module options, such as URI and database name.
   */
  useFactory?: (
    ...args: never[]
  ) => Promise<KubernetesModuleOptions> | KubernetesModuleOptions;

  /**
   * Inject any dependencies required by the module, such as a configuration service
   */
  inject?: never[];
}
