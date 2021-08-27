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
 * File name:         dependencies.js
 * Last modified:     15/07/2021, 23:29
 ******************************************************************************/

const coreDependency = {
  name: "@ultimate-backend/core",
  peerDependencies: ["@ultimate-backend/bootstrap", "@ultimate-backend/common", "connect-redis", "express-session", "csurf", "cookie-parser", "@nestjs/graphql", "graphql", "ioredis", "@nestjs/swagger", "@nestjs/microservices"],
  dependencies: ["base64-url", "base64-url", "graphql", "moment", "vhost"],
  devDependencies: [],
}

const loadbalancerDependency = {
  name: "@ultimate-backend/loadbalancer",
  peerDependencies: ["@ultimate-backend/common", "@nestjs/common", "@nestjs/core","@ultimate-backend/bootstrap"],
  dependencies: ["rxjs", "reflect-metadata", "lodash"],
  devDependencies: [],
}

const redisDependency = {
  name: "@ultimate-backend/redis",
  peerDependencies: ["@nestjs/common", "@ultimate-backend/common","@ultimate-backend/bootstrap"],
  dependencies: ["ioredis", "rxjs", "lodash"],
  devDependencies: [],
}

const zookeeperDependency = {
  name: "@ultimate-backend/zookeeper",
  peerDependencies: ["@nestjs/common", "@ultimate-backend/common","@ultimate-backend/bootstrap"],
  dependencies: ["rxjs", "lodash", "zookeeper", "uuid"],
  devDependencies: [],
}

const pluginNxDependency = {
  name: "@ultimate-backend/plugin-nx",
  peerDependencies: [],
  dependencies: ["@nrwl/linter", "@angular-devkit/schematics", "@angular-devkit/core", "lodash"],
  devDependencies: [],
}

const permissionsDependency = {
  name: "@ultimate-backend/permissions",
  peerDependencies: ["@ultimate-backend/common", "@nestjs/common"],
  dependencies: ["oso"],
  devDependencies: [],
}

const kubernetesDependency = {
  name: "@ultimate-backend/kubernetes",
  peerDependencies: ["@ultimate-backend/common", "@nestjs/common", "@ultimate-backend/bootstrap"],
  dependencies: ["lodash", "rxjs", "@kubernetes/client-node"],
  devDependencies: [],
}

const eventStoreDependency = {
  name: "@ultimate-backend/event-store",
  peerDependencies: ["@ultimate-backend/common", "@nestjs/common", "@ultimate-backend/bootstrap", "@nestjs/cqrs", "@google-cloud/pubsub", "@eventstore/db-client", "kafkajs", "node-nats-streaming"],
  dependencies: ["lodash", "uuid", "rxjs"],
  devDependencies: [],
}

const etcdDependency = {
  name: "@ultimate-backend/etcd",
  peerDependencies: ["@ultimate-backend/common", "@nestjs/common", "@ultimate-backend/bootstrap"],
  dependencies: ["etcd3", "lodash", "rxjs", "uuid"],
  devDependencies: [],
}

const consulDependency = {
  name: "@ultimate-backend/consul",
  peerDependencies: ["@ultimate-backend/common", "@nestjs/common", "@ultimate-backend/bootstrap", "@ultimate-backend/loadbalancer"],
  dependencies: ["consul", "lodash", "rxjs", "uuid"],
  devDependencies: [],
}

const configDependency = {
  name: "@ultimate-backend/config",
  peerDependencies: ["@nestjs/core", "@ultimate-backend/common", "@nestjs/common", "@ultimate-backend/bootstrap", "@ultimate-backend/loadbalancer", "@ultimate-backend/consul", "@ultimate-backend/etcd", "@ultimate-backend/zookeeper"],
  dependencies: ["lodash", "rxjs", "dotenv",  "read-env", "handlebars", "reflect-metadata"],
  devDependencies: [],
}

const commonDependency = {
  name: "@ultimate-backend/common",
  peerDependencies: ["@nestjs/core", "@nestjs/common"],
  dependencies: ["lodash", "rxjs", "yaml", "@iarna/toml", "reflect-metadata", "ip"],
  devDependencies: [],
}

const cloudDependency = {
  name: "@ultimate-backend/cloud",
  peerDependencies: ["@ultimate-backend/etcd", "@nestjs/common", "@ultimate-backend/common", "@ultimate-backend/consul", "@ultimate-backend/zookeeper", "@ultimate-backend/bootstrap"],
  dependencies: ["lodash", "bonjour", "uuid"],
  devDependencies: [],
}

const clientDependency = {
  name: "@ultimate-backend/client",
  peerDependencies: ["@nestjs/common", "@ultimate-backend/common", "@ultimate-backend/brakes", "@nestjs/core", "@ultimate-backend/bootstrap"],
  dependencies: ["lodash", "got", "rxjs", "uuid", "@nestjs/microservices", "graphql-request"],
  devDependencies: [],
}

const cliDependency = {
  name: "@ultimate-backend/cli",
  peerDependencies: [],
  dependencies: ["tslib", "commander", "chalk", "ora", "shelljs", "cli-spinners"],
  devDependencies: [],
}

const brakesDependency = {
  name: "@ultimate-backend/brakes",
  peerDependencies: ["@nestjs/common"],
  dependencies: ["opossum"],
  devDependencies: [],
}

const bootstrapDependency = {
  name: "@ultimate-backend/bootstrap",
  peerDependencies: ["@nestjs/common", "@nestjs/core", "@ultimate-backend/common"],
  dependencies: ["lodash", "reflect-metadata", "handlebars"],
  devDependencies: [],
}

function cleaDepsTree(obj, replacement) {
  const deps = obj.dependencies;
  const peerDeps = obj.peerDependencies;
  const devDeps = obj.devDependencies;

  const newDeps = {};
  const newDevDeps = {};
  const newPeerDeps = {};

  for (const key in deps) {
    if ((replacement.dependencies || []).includes(key)) {
      newDeps[key] = deps[key];
    }

    if ((replacement.peerDependencies || []).includes(key)) {
      newPeerDeps[key] = peerDeps[key];
    }

    if ((replacement.peerDependencies || []).includes(key)) {
      newPeerDeps[key] = peerDeps[key];
    }
  }

  for (const key in peerDeps) {
    if ((replacement.dependencies || []).includes(key)) {
      newDeps[key] = deps[key];
    }

    if ((replacement.peerDependencies || []).includes(key)) {
      newPeerDeps[key] = peerDeps[key];
    }

    if ((replacement.peerDependencies || []).includes(key)) {
      newPeerDeps[key] = peerDeps[key];
    }
  }

  for (const key in devDeps) {
    if ((replacement.dependencies || []).includes(key)) {
      newDeps[key] = deps[key];
    }

    if ((replacement.peerDependencies || []).includes(key)) {
      newPeerDeps[key] = peerDeps[key];
    }

    if ((replacement.peerDependencies || []).includes(key)) {
      newPeerDeps[key] = peerDeps[key];
    }
  }

  obj.dependencies = newDeps;
  obj.peerDependencies = newPeerDeps;
  obj.devDependencies = newDevDeps;

  return obj;
}

function prunePackages(obj) {
  switch (obj.name) {
    case coreDependency.name:
      return cleaDepsTree(obj, coreDependency);
    case loadbalancerDependency.name:
      return cleaDepsTree(obj, loadbalancerDependency);
    case redisDependency.name:
      return cleaDepsTree(obj, redisDependency);
    case zookeeperDependency.name:
      return cleaDepsTree(obj, zookeeperDependency);
    case pluginNxDependency.name:
      return cleaDepsTree(obj, pluginNxDependency);
    case permissionsDependency.name:
      return cleaDepsTree(obj, permissionsDependency);
    case kubernetesDependency.name:
      return cleaDepsTree(obj, kubernetesDependency);
    case eventStoreDependency.name:
      return cleaDepsTree(obj, eventStoreDependency);
    case etcdDependency.name:
      return cleaDepsTree(obj, etcdDependency);
    case consulDependency.name:
      return cleaDepsTree(obj, consulDependency);
    case configDependency.name:
      return cleaDepsTree(obj, configDependency);
    case commonDependency.name:
      return cleaDepsTree(obj, commonDependency);
    case cloudDependency.name:
      return cleaDepsTree(obj, cloudDependency);
    case clientDependency.name:
      return cleaDepsTree(obj, clientDependency);
    case brakesDependency.name:
      return cleaDepsTree(obj, brakesDependency);
    case bootstrapDependency.name:
      return cleaDepsTree(obj, bootstrapDependency);
    case cliDependency.name:
      return cleaDepsTree(obj, cliDependency);
  }
}

module.exports = {
  prunePackages,
  cleaDepsTree,
}
