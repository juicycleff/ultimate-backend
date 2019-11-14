import { GetTenantMemberHandler } from './get-tenant-member.handler';
import { GetTenantMembersHandler } from './get-tenant-members.handler';

export const TenantMemberQueryHandlers = [
  GetTenantMemberHandler,
  GetTenantMembersHandler,
];
