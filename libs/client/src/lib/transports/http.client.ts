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
 * File name:         http.client.ts
 * Last modified:     18/03/2021, 23:08
 ******************************************************************************/
import * as got from 'got';
import {
  LoadBalancerClient,
  LoadBalancerRequest,
} from '@ultimate-backend/loadbalancer';
import { HttpGotOptions, IHttpServiceClient } from '../interface';
import { Brakes } from '@ultimate-backend/brakes';
import { merge } from 'lodash';
import { ServiceInstance } from '@ultimate-backend/common';
import { HttpException, Logger, Optional } from '@nestjs/common';

export class HttpClient {
  logger = new Logger(HttpClient.name);
  private serviceId: string;
  private node: ServiceInstance;
  private httpOpts: HttpGotOptions & {
    baseUrl?: string;
    responseType?: 'json';
  } = {
    responseType: 'json',
  };
  private instance: got.GotInstance<got.GotBodyFn<string>>;

  constructor(
    private readonly lb: LoadBalancerClient,
    options: IHttpServiceClient,
    @Optional() private readonly brakes: Brakes
  ) {
    this.init(options);
  }

  init(options: IHttpServiceClient) {
    try {
      this.serviceId = options.service;
      const { baseUrl } = this.getServiceAddress();
      this.httpOpts = this.mergeOptions(options, {
        responseType: 'json',
        baseUrl,
      });
      this.instance = got.extend({
        ...this.httpOpts,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async get<T>(
    path: string,
    options?: Partial<HttpGotOptions>
  ): Promise<got.GotPromise<any>> {
    return await this.request(path, 'GET', options);
  }

  async head<T>(
    path: string,
    options?: Partial<HttpGotOptions>
  ): Promise<got.GotPromise<any>> {
    return await this.request(path, 'HEAD', options);
  }

  async delete<T>(
    path: string,
    options?: Partial<HttpGotOptions>
  ): Promise<got.GotPromise<any>> {
    return await this.request(path, 'DELETE', options);
  }

  async post<T>(
    path: string,
    options?: Partial<HttpGotOptions>
  ): Promise<got.GotPromise<any>> {
    return await this.request(path, 'POST', options);
  }

  async options<T>(
    path: string,
    options?: Partial<HttpGotOptions>
  ): Promise<got.GotPromise<any>> {
    return await this.request(path, 'OPTIONS', options);
  }

  async trace<T>(
    path: string,
    options?: Partial<HttpGotOptions>
  ): Promise<got.GotPromise<any>> {
    return await this.request(path, 'TRACE', options);
  }

  async put<T>(
    path: string,
    options?: Partial<HttpGotOptions>
  ): Promise<got.GotPromise<any>> {
    return await this.request(path, 'PUT', options);
  }

  private doRequest(
    path: string,
    method: string,
    options?: Partial<HttpGotOptions>
  ): got.GotPromise<string> {
    return this.lb.execute(
      this.serviceId,
      this.node,
      new LoadBalancerRequest<
        Promise<got.Response<string>> & { cancel(): void }
      >(this.instance, path, {
        ...options,
        method,
      })
    );
  }

  public request(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'HEAD' | 'DELETE' | 'OPTIONS' | 'TRACE',
    options?: Partial<HttpGotOptions>
  ) {
    if (this.brakes) {
      return this.requestWithBrakes(path, method, options);
    }

    return this.doRequest(path, method, options);
  }

  private async requestWithBrakes(
    path: string,
    method: string,
    options?: Partial<HttpGotOptions>
  ) {
    let err: HttpException = null;
    const ref = this.brakes.prepare(this.serviceId, async () => {
      try {
        return await this.doRequest(path, method, options);
      } catch (e) {
        err = e;
        if (e instanceof HttpException) {
          return;
        }
        throw e;
      }
    });
    const response = await ref(options);

    if (err) {
      throw err;
    }
    return response;
  }

  private mergeOptions(
    target: HttpGotOptions & { baseUrl?: string; responseType?: 'json' },
    source?: HttpGotOptions & { baseUrl?: string; responseType?: 'json' }
  ) {
    return merge({}, target, source);
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
