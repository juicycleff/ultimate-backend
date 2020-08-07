import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserPasswordUpdatedEvent } from '../../impl';

@EventsHandler(UserPasswordUpdatedEvent)
export class UserPasswordUpdatedHandler
  implements IEventHandler<UserPasswordUpdatedEvent> {
  handle(event: UserPasswordUpdatedEvent): any {
    Logger.log(event, event.constructor.name);
  }
}
