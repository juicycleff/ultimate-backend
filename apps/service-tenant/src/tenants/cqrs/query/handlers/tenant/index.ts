import { GetTenantHandler } from './get-tenant.handler';
import { GetTenantsHandler } from './get-tenants.handler';
import { TenantAvailableHandler } from './tenant-available.handler';

export const TenantQueryHandlers = [
  GetTenantHandler,
  GetTenantsHandler,
  TenantAvailableHandler,
];
