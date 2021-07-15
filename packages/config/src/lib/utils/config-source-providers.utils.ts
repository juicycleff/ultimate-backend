/* eslint-disable no-case-declarations */
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
 * File name:         config-source-providers.find-type.utils.ts
 * Last modified:     14/03/2021, 17:07
 ******************************************************************************/

import { ConfigModuleOptions } from '../interfaces';
import { Provider } from '@nestjs/common';
import { ConfigSource } from '@ultimate-backend/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util';

export function configSourceProviders(
  options: ConfigModuleOptions
): Provider[] {
  const providers: Provider[] = [];
  let importPackage;

  if (!Array.isArray(options.load)) {
    switch (options.load.source) {
      case ConfigSource.Env:
        const { ConfigEnvSource } = require('../sources/config-env.source');
        providers.push(ConfigEnvSource);
        break;
      case ConfigSource.Consul:
        importPackage = loadPackage(
          '@ultimate-backend/consul',
          '@ultimate-backend/consul',
          () => require('@ultimate-backend/consul')
        );
        providers.push(importPackage.ConfigConsulSource);
        break;
      case ConfigSource.Zookeeper:
        importPackage = loadPackage(
          '@ultimate-backend/zookeeper',
          '@ultimate-backend/zookeeper',
          () => require('@ultimate-backend/zookeeper')
        );
        providers.push(importPackage.ConfigZookeeperSource);
        break;
      case ConfigSource.File:
        const { ConfigFileSource } = require('../sources/config-file.source');
        providers.push(ConfigFileSource);
        break;
      case ConfigSource.Etcd:
        importPackage = loadPackage(
          '@ultimate-backend/etcd',
          '@ultimate-backend/etcd',
          () => require('@ultimate-backend/etcd')
        );
        providers.push(importPackage.ConfigEtcdSource);
        break;
      case ConfigSource.Kubernetes:
        importPackage = loadPackage(
          '@ultimate-backend/kubernetes',
          '@ultimate-backend/kubernetes',
          () => require('@ultimate-backend/kubernetes')
        );
        providers.push(importPackage.KubernetesConfigSource);
        break;
      default:
        const importPack = require('../sources/config-env.source');
        providers.push(importPack.ConfigEnvSource);
        break;
    }
  } else {
    const envs = options.load.filter(
      (value) => value.source === ConfigSource.Env
    );
    if (envs.length > 0) {
      const { ConfigEnvSource } = require('../sources/config-env.source');
      providers.push(ConfigEnvSource);
    }

    const etcds = options.load.filter(
      (value) => value.source === ConfigSource.Etcd
    );
    if (etcds.length > 0) {
      importPackage = loadPackage(
        '@ultimate-backend/etcd',
        '@ultimate-backend/etcd',
        () => require('@ultimate-backend/etcd')
      );
      providers.push(importPackage.ConfigEtcdSource);
    }

    const files = options.load.filter(
      (value) => value.source === ConfigSource.File
    );
    if (files.length > 0) {
      const { ConfigFileSource } = require('../sources/config-file.source');
      providers.push(ConfigFileSource);
    }

    const consuls = options.load.filter(
      (value) => value.source === ConfigSource.Consul
    );
    if (consuls.length > 0) {
      importPackage = loadPackage(
        '@ultimate-backend/consul',
        '@ultimate-backend/consul',
        () => require('@ultimate-backend/consul')
      );
      providers.push(importPackage.ConfigConsulSource);
    }

    const zookeepers = options.load.filter(
      (value) => value.source === ConfigSource.Zookeeper
    );
    if (zookeepers.length > 0) {
      importPackage = loadPackage(
        '@ultimate-backend/zookeeper',
        '@ultimate-backend/zookeeper',
        () => require('@ultimate-backend/zookeeper')
      );
      providers.push(importPackage.ConfigZookeeperSource);
    }

    const k8s = options.load.filter(
      (value) => value.source === ConfigSource.Kubernetes
    );
    if (k8s.length > 0) {
      importPackage = loadPackage(
        '@ultimate-backend/kubernetes',
        '@ultimate-backend/kubernetes',
        () => require('@ultimate-backend/kubernetes')
      );
      providers.push(importPackage.KubernetesConfigSource);
    }
  }

  return providers;
}
