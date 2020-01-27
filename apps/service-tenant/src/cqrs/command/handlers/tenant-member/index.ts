import { RemoveTenantMemberHandler } from './remove-tenant-member.handler';
import { CreateTenantMemberHandler } from './create-tenant-member.handler';
import { InviteTenantMemberHandler } from './invite-tenant-member.handler';

export const TenantMemberCommandHandlers = [
  RemoveTenantMemberHandler,
  CreateTenantMemberHandler,
  InviteTenantMemberHandler,
];
