import { CreateTenantHandler } from './create-tenant.handler';
import { CreateTenantMemberHandler } from '../tenant/create-tenant-member.handler';

export const TenantCommandHandlers = [
  CreateTenantHandler,
  CreateTenantMemberHandler,
];
