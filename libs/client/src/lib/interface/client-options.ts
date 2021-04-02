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
 * File name:         client-options.ts
 * Last modified:     18/03/2021, 22:33
 ******************************************************************************/
import { ChannelOptions } from '@nestjs/microservices/external/grpc-options.interface';
import { GotBodyOptions, Hooks, RetryOptions, TimeoutOptions } from 'got';
import * as nodeStream from 'stream';
import * as Dom from 'graphql-request/dist/types.dom';

export interface IGrpcServiceClient {
  transport: 'grpc';
  service?: string;
  url?: string;
  package: string;
  protoPath: string;
  maxSendMessageLength?: number;
  maxReceiveMessageLength?: number;
  maxMetadataSize?: number;
  keepalive?: {
    keepaliveTimeMs?: number;
    keepaliveTimeoutMs?: number;
    keepalivePermitWithoutCalls?: number;
    http2MaxPingsWithoutData?: number;
    http2MinTimeBetweenPingsMs?: number;
    http2MinPingIntervalWithoutDataMs?: number;
    http2MaxPingStrikes?: number;
  };
  channelOptions?: ChannelOptions;
  credentials?: any;
  protoLoader?: string;
  loader?: {
    keepCase?: boolean;
    alternateCommentMode?: boolean;
    longs?: Function;
    enums?: Function;
    bytes?: Function;
    defaults?: boolean;
    arrays?: boolean;
    objects?: boolean;
    oneofs?: boolean;
    json?: boolean;
    includeDirs?: string[];
  };
}

export interface HttpGotOptions {
  header?: { [key: string]: string };
  body?: string | Buffer | nodeStream.Readable;
  hooks?: Hooks<GotBodyOptions<any>, string | Buffer | nodeStream.Readable>;
  timeout?: number | TimeoutOptions;
  retry?: number | RetryOptions;
  decompress?: boolean;
  throwHttpErrors?: boolean;
  http2?: boolean;
  followRedirect?: boolean;
  isStream?: boolean;
  auth?: string;
  ca?: string;
  searchParams?: URLSearchParams;
}

export interface IHttpServiceClient extends HttpGotOptions {
  transport: 'http';
  service?: string;
  url?: string;
}
export interface IGraphQLServiceClient extends Dom.RequestInit {
  transport: 'graphql';
  service?: string;
  path: string;
  url?: string;
}

export type ClientOptions = IGrpcServiceClient | IHttpServiceClient | IGraphQLServiceClient;
