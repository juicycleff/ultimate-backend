import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MemberRemovedEvent } from '../../impl';

@EventsHandler(MemberRemovedEvent)
export class MemberRemovedHandler implements IEventHandler<MemberRemovedEvent> {
  handle(event: MemberRemovedEvent): any {
    Logger.log(event, 'MemberRemovedEvent');
  }
}
