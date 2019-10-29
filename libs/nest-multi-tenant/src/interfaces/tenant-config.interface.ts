import { TenantDatabaseStrategy, TenantResolverType } from '../tenant.enum';

export interface MultiTenancyConfig {
  enabled?: boolean;
  tenantResolver: TenantResolver;
  databaseStrategy?: TenantDatabaseStrategy;
}

export interface TenantInfo {
  config?: MultiTenancyConfig;
  tenant?: string;
  connectionString?: string;
  accessToken?: {
    key: string;
    secret: string;
  };
}

export interface TenantData {
  tenantName?: string;
}

export type TenantResolver =
  {
    resolverType: 'Domain',
    headerKeys?: {
      key?: string,
      secret?: string,
    },
    requiresToken?: boolean;
  } | {
    resolverType: 'Header',
    headerKeys?: {
      tenant: string,
      key?: string,
      secret?: string,
    },
    requiresToken?: boolean;
  } | {
    resolverType: 'Cookie',
    cookieKeys?: {
      tenant: string,
      key?: string,
      secret?: string,
    },
    requiresToken?: boolean;
  } | {
    resolverType: 'Query',
    queryKeys?: {
      tenant: string,
      key?: string,
      secret?: string,
    },
    requiresToken?: boolean;
  } | {
    resolverType: 'Params',
    paramKeys?: {
      tenant: string,
    },
    headerKeys?: {
      key?: string,
      secret?: string,
    },
    requiresToken?: boolean;
  };
