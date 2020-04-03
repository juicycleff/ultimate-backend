import { RemoveMemberHandler } from './remove-member.handler';
import { AcceptInvitationHandler } from './accept-invitation.handler';
import { InviteMemberHandler } from './invite-member.handler';
import { UpdateMemberHandler } from './update-member.handler';

export const MemberCommandHandlers = [
  RemoveMemberHandler,
  AcceptInvitationHandler,
  InviteMemberHandler,
  UpdateMemberHandler,
];
