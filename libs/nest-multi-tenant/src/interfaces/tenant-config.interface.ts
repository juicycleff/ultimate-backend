import { TenantDatabaseStrategy, TenantResolverType } from '../tenant.enum';

export interface MultiTenancyConfig {
  enabled?: boolean;
  resolverType?: TenantResolverType;
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
