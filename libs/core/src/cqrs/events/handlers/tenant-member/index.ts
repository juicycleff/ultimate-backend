import { TenantMemberCreatedHandler } from './tenant-member-created.handler';
import { TenantMemberInvitedHandler } from './tenant-member-invited.handler';

export const TenantMemberEventHandlers = [
  TenantMemberCreatedHandler,
  TenantMemberInvitedHandler,
];
