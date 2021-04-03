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
 * File name:         multi-tenant.config.ts
 * Last modified:     03/04/2021, 02:19
 ******************************************************************************/
import { MultiTenantDatabaseStrategy } from './multi-tenant.enum';

export interface MultiTenancyConfig {
  enabled?: boolean;
  tenantResolver: MultiTenantResolver;
  databaseStrategy?: MultiTenantDatabaseStrategy;
}

export interface MultiTenantInfo {
  config?: MultiTenancyConfig;
  tenantId?: string;
  accessToken?: {
    key: string;
  };
}

export type MultiTenantResolver =
  | {
  resolverType: 'Domain';
  headerKeys?: {
    apiKey?: string;
  };
  requiresToken?: boolean;
}
  | {
  resolverType: 'Header';
  headerKeys?: {
    tenant: string;
    apiKey?: string;
  };
  requiresToken?: boolean;
}
  | {
  resolverType: 'Query';
  queryKeys?: {
    tenant: string;
    apiKey?: string;
  };
  requiresToken?: boolean;
}
  | {
  resolverType: 'Cookie';
  cookieKeys?: {
    tenant: string;
    apiKey?: string;
  };
  requiresToken?: boolean;
}
  | {
  resolverType: 'Params';
  paramKeys?: {
    tenant: string;
  };
  headerKeys?: {
    apiKey?: string;
  };
  requiresToken?: boolean;
};

export interface ITenantServiceConfig {
  /**
   * @description the name of the microservice
   * @example comments
   */
  serviceName: string;

  /**
   * @description the databaseName must be a non uri and just the database name like
   * @example comments
   */
  databaseName: string;

  /**
   * @description the dbUri must have an end slash like this /
   * @example mongodb://localhost:27017/
   */
  databaseUri: string;
}
