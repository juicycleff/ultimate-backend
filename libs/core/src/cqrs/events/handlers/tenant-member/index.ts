import { TenantMemberCreatedHandler } from './tenant-member-created.handler';
import { TenantMemberInvitedHandler } from './tenant-member-invited.handler';
import { TenantMemberRemovedHandler } from './tenant-member-removed.handler';

export const TenantMemberEventHandlers = [
  TenantMemberCreatedHandler,
  TenantMemberInvitedHandler,
  TenantMemberRemovedHandler,
];
