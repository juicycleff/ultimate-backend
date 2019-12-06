import { RemoveTenantMemberHandler } from './remove-tenant-member.handler';
import { CreateTenantMemberHandler } from '../tenant/create-tenant-member.handler';

export const TenantMemberCommandHandlers = [
  RemoveTenantMemberHandler,
  CreateTenantMemberHandler,
];
