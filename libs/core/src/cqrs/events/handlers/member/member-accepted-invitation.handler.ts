import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MemberAcceptedInvitationEvent } from '../../impl';

@EventsHandler(MemberAcceptedInvitationEvent)
export class MemberAcceptedInvitationHandler
  implements IEventHandler<MemberAcceptedInvitationEvent> {
  handle(event: MemberAcceptedInvitationEvent): any {
    Logger.log(event, 'MemberAcceptedInvitationEvent');
  }
}
