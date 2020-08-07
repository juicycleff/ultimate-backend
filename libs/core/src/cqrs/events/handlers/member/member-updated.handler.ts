import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MemberUpdatedEvent } from '../../impl';

@EventsHandler(MemberUpdatedEvent)
export class MemberUpdatedHandler implements IEventHandler<MemberUpdatedEvent> {
  handle(event: MemberUpdatedEvent): any {
    Logger.log(event, 'MemberUpdatedEvent');
  }
}
