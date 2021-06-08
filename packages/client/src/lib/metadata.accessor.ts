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
 * File name:         metadata.accessor.ts
 * Last modified:     18/03/2021, 23:19
 ******************************************************************************/
import { Reflector } from '@nestjs/core';
import { Injectable } from '@nestjs/common';
import { ClientMetadata } from './interface/client-metdata.interface';
import {
  CLIENT_SERVICE,
  GRAPHQL_CLIENT_SERVICE,
  GRPC_CLIENT_SERVICE,
  HTTP_CLIENT_SERVICE,
} from './client.constants';

@Injectable()
export class MetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  getGrpcServices(target: Function): ClientMetadata[] | undefined {
    return this.reflector.get(GRPC_CLIENT_SERVICE, target);
  }

  getHttpServices(target: Function): ClientMetadata[] | undefined {
    return this.reflector.get(HTTP_CLIENT_SERVICE, target);
  }

  getGraphQLServices(target: Function): ClientMetadata[] | undefined {
    return this.reflector.get(GRAPHQL_CLIENT_SERVICE, target);
  }

  getClientServices(target: Function): ClientMetadata[] | undefined {
    return this.reflector.get(CLIENT_SERVICE, target);
  }

  getAllServices(target: Function): ClientMetadata[] | undefined {
    let c = this.getClientServices(target);
    if (c) {
      return c;
    }

    c = this.getGrpcServices(target);
    if (c) {
      return c;
    }

    c = this.getGraphQLServices(target);
    if (c) {
      return c;
    }

    c = this.getHttpServices(target);
    if (c) {
      return c;
    }

    return undefined;
  }
}
