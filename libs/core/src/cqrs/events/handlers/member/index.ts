import { MemberUpdatedHandler } from './member-updated.handler';
import { MemberInvitedHandler } from './member-invited.handler';
import { MemberRemovedHandler } from './member-removed.handler';
import { MemberAcceptedInvitationHandler } from './member-accepted-invitation.handler';

export const MemberEventHandlers = [
  MemberUpdatedHandler,
  MemberInvitedHandler,
  MemberRemovedHandler,
  MemberAcceptedInvitationHandler,
];
