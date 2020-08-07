import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserUpdatedEvent } from '../../impl';

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  handle(event: UserUpdatedEvent): any {
    Logger.log(event, 'UserUpdatedEvent'); // write here
  }
}
