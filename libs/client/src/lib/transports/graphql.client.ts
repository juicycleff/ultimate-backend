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
 * File name:         graphql.client.ts
 * Last modified:     18/03/2021, 23:08
 ******************************************************************************/
import {
  LoadBalancerClient,
  LoadBalancerRequest,
} from '@ultimate-backend/loadbalancer';
import { IGraphQLServiceClient } from '../interface';
import { Brakes } from '@ultimate-backend/brakes';
import { GraphqlClientExecuteException, ServiceInstance } from '@ultimate-backend/common';
import { HttpException, Logger, Optional } from '@nestjs/common';
import { GraphQLClient as GqlClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import { GraphQLError, RequestDocument, Variables } from 'graphql-request/dist/types';

export class GraphQLClient {
  logger = new Logger(GraphQLClient.name);
  private serviceId: string;
  private node: ServiceInstance;
  private instance: GqlClient;

  constructor(
    private readonly lb: LoadBalancerClient,
    private readonly options: IGraphQLServiceClient,
    @Optional() private readonly brakes: Brakes
  ) {
    this.init();
  }

  init() {
    try {
      const { service, path, url, transport, ...rest } = this.options;
      if (!service) {
        throw new GraphqlClientExecuteException('missing service id/name')
      }

      this.serviceId = service;

      const { baseUrl } = this.getServiceAddress();
      const endpoint = baseUrl + this.options.path;

      this.instance = new GqlClient(endpoint, rest);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async request<T, V = Variables>(document: RequestDocument, variables?: V, requestHeaders?: Dom.RequestInit['headers']): Promise<T> {
    const raw = false;
    return this.initiateRequest<T, V>([raw, document, variables, requestHeaders]);
  }

  async rawRequest<T, V = Variables>(query: string, variables?: V, requestHeaders?: Dom.RequestInit['headers']): Promise<{
    data?: T;
    extensions?: any;
    headers: Dom.Headers;
    status: number;
    errors?: GraphQLError[];
  }> {
    const raw = true;
    return this.initiateRequest<T, V>([raw, query, variables, requestHeaders]);
  }

  setHeader(key: string, value: string) {
    return this.instance.setHeader(key, value);
  }

  setHeaders(headers: Dom.RequestInit['headers']) {
    return this.instance.setHeaders(headers);
  }

  private doRequest<T, V>(args: any[]): T {
    return this.lb.executeGraphql<T, V>(
      this.serviceId,
      this.node,
      new LoadBalancerRequest(this.instance, args)
    );
  }

  public initiateRequest<T, V>(args: any[]) {
    if (this.brakes) {
      return this.requestWithBrakes<T, V>(args);
    }

    return this.doRequest<T, V>(args);
  }

  private async requestWithBrakes<T, V>(args: any[]) {
    let err: HttpException = null;
    const ref = this.brakes.prepare(this.serviceId, async () => {
      try {
        return await this.doRequest<T, V>(args);
      } catch (e) {
        err = e;
        if (e instanceof HttpException) {
          return;
        }
        throw e;
      }
    });
    const response = await ref(args);

    if (err) {
      throw err;
    }
    return response;
  }

  private getServiceAddress<T extends {}>(): {
    baseUrl: string;
    node: ServiceInstance;
  } {
    this.node = this.lb.choose(this.serviceId);
    const baseUrl = `${this.node.getScheme()}://${this.node.getHost()}:${this.node.getPort()}`;
    return { baseUrl, node: this.node };
  }
}
