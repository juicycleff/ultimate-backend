import { CreateTenantHandler } from './create-tenant.handler';
import { RemoveTenantHandler } from './remove-tenant.handler';

export const TenantCommandHandlers = [CreateTenantHandler, RemoveTenantHandler];
