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
 * File name:         config-options.interface.ts
 * Last modified:     07/02/2021, 23:32
 ******************************************************************************/

import { ModuleMetadata, Type } from '@nestjs/common';
import { ConfigSource } from '../config.enum';

export interface BaseConfigOptions {
  enableCache?: boolean;
}

export interface EnvConfigOptions extends BaseConfigOptions {
  source: ConfigSource.Env;
  envFilePath?: string;
  ignoreEnvFile?: true;
}

export interface FileConfigOptions extends BaseConfigOptions {
  source: ConfigSource.File;
  filePath?: string;
}

export interface ConsulConfigOptions extends BaseConfigOptions {
  source: ConfigSource.Consul;
  prefix?: string;
  key: string;
}

export interface EtcdConfigOptions extends BaseConfigOptions {
  source: ConfigSource.Etcd;
  prefix?: string;
  key: string;
}

export interface ZookeeperConfigOptions extends BaseConfigOptions {
  source: ConfigSource.Zookeeper;
  prefix?: string;
  key: string;
}

export type Configurations =
  | EnvConfigOptions
  | ConsulConfigOptions
  | ZookeeperConfigOptions
  | FileConfigOptions
  | EtcdConfigOptions;

export interface ConfigModuleOptions {
  load: Configurations | Array<Configurations>;
  namespace?: string;
  global?: boolean;
  debug?: boolean;
}

export interface ConfigModuleOptionsFactory {
  createConfigOptions(): Promise<ConfigModuleOptions> | ConfigModuleOptions;
}

/**
 * Options available when creating the module asynchronously.  You should use only one of the
 * useExisting, useClass, or useFactory options for creation.
 */
export interface ConfigModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /** Reuse an injectable factory class created in another module. */
  useExisting?: Type<ConfigModuleOptionsFactory>;

  /**
   * Use an injectable factory class to populate the module options, such as URI and database name.
   */
  useClass?: Type<ConfigModuleOptionsFactory>;

  /**
   * A factory function that will populate the module options, such as URI and database name.
   */
  useFactory?: (
    ...args: never[]
  ) => Promise<ConfigModuleOptions> | ConfigModuleOptions;

  /**
   * Inject any dependencies required by the Mongo module, such as a configuration service
   * that supplies the URI and database name
   */
  inject?: never[];
}
