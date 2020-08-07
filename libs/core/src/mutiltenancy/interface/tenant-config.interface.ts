import { TenantDatabaseStrategy } from './tenant.enum';

export interface MultiTenancyConfig {
  enabled?: boolean;
  tenantResolver: TenantResolver;
  databaseStrategy?: TenantDatabaseStrategy;
}

export interface TenantInfo {
  config?: MultiTenancyConfig;
  tenantId?: string;
  accessToken?: {
    key: string;
  };
}

export type TenantResolver =
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
   * @description the dbName must be a non uri and just the database name like
   * @example comments
   */
  dbName: string;

  /**
   * @description the dbUri must have an end slash like this /
   * @example mongodb://localhost:27017/
   */
  dbUri: string;

  /**
   * @description If you are using a replica cluster, there is an extra string at the
   * @description end of the uri that looks like this "?retryWrites=true&w=majority"
   * @example "?retryWrites=true&w=majority"
   */
  dbReplicaOptions?: string;
}
