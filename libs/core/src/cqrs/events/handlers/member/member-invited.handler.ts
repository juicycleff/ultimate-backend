import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MemberInvitedEvent } from '../../impl';

@EventsHandler(MemberInvitedEvent)
export class MemberInvitedHandler implements IEventHandler<MemberInvitedEvent> {
  handle(event: MemberInvitedEvent): any {
    Logger.log(event, 'MemberInvitedEvent');
  }
}
