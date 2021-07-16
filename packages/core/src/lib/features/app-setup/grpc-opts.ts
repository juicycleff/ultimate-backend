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
 * File name:         grpc-opts.ts
 * Last modified:     03/04/2021, 01:15
 ******************************************************************************/

/**
 * An interface that contains options used when initializing a Channel instance.
 * This listing is incomplete. Full reference: https://grpc.github.io/grpc/core/group__grpc__arg__keys.html
 */
export interface ChannelOptions {
  'grpc.ssl_target_name_override'?: string;
  'grpc.primary_user_agent'?: string;
  'grpc.secondary_user_agent'?: string;
  'grpc.default_authority'?: string;
  'grpc.service_config'?: string;
  'grpc.max_concurrent_streams'?: number;
  'grpc.initial_reconnect_backoff_ms'?: number;
  'grpc.max_reconnect_backoff_ms'?: number;
  'grpc.use_local_subchannel_pool'?: number;
  [key: string]: string | number | undefined;
}

export interface GrpcOpts {
  url?: string;
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
  protoPath: string | string[];
  package: string | string[];
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

export type SecuritySchemeType = 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
export interface SecuritySchemeObject {
  type: SecuritySchemeType;
  description?: string;
  name?: string;
  in?: string;
  scheme?: string;
  bearerFormat?: string;
  flows?: OAuthFlowsObject;
  openIdConnectUrl?: string;
}
export interface OAuthFlowsObject {
  implicit?: OAuthFlowObject;
  password?: OAuthFlowObject;
  clientCredentials?: OAuthFlowObject;
  authorizationCode?: OAuthFlowObject;
}
export interface OAuthFlowObject {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: any;
}

export interface SwaggerConfig {
  title?: string;
  description?: string;
  version?: string;
  tag?: string;
  basePath?: string;
  auth?: {
    authType: 'bearer' | 'basic' | 'cookie' | 'apiKey' | 'oauth2';
    option?: SecuritySchemeObject;
    name?: string;
  };
}
