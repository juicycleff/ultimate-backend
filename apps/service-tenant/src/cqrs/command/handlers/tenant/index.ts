import { CreateTenantHandler } from './create-tenant.handler';
import { CreateTenantMemberHandler } from './create-tenant-member.handler';

export const TenantCommandHandlers = [
  CreateTenantHandler,
  CreateTenantMemberHandler,
];
