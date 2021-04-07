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
 * File name:         client.factory.ts
 * Last modified:     18/03/2021, 23:36
 ******************************************************************************/
import { LoadBalancerClient } from '@ultimate-backend/loadbalancer';
import { ClientOptions } from './interface';
import { GrpcClient, HttpClient } from './transports';
import { Brakes } from '@ultimate-backend/brakes';
import { GraphQLClient } from './transports/graphql.client';

export class ClientFactory {
  private static cache = new Map<
    string,
    HttpClient | GrpcClient | GraphQLClient
  >();

  static create(
    lb: LoadBalancerClient,
    brakes: Brakes,
    config: ClientOptions,
    force?: boolean
  ) {
    const key = this.generateKey(config);
    if (!this.cache.has(key) || force) {
      if (config.transport === 'grpc') {
        const client = new GrpcClient(lb, config);
        this.cache.set(key, client);
        return client;
      } else if (config.transport === 'http') {
        const client = new HttpClient(lb, config, brakes);
        this.cache.set(key, client);
        return client;
      } else if (config.transport === 'graphql') {
        const client = new GraphQLClient(lb, config, brakes);
        this.cache.set(key, client);
        return client;
      }
    }

    return this.cache.get(key);
  }

  private static generateKey(config: ClientOptions) {
    const service = config.service || config.url;
    if (config.transport === 'grpc') {
      return `${service}/grpc/${config.package}/${config.protoPath}`;
    } else if (config.transport === 'graphql') {
      return `${service}/graphql/${config.path}/${config.url}`;
    }

    return `${service}/http/${config.url || ''}`;
  }
}
