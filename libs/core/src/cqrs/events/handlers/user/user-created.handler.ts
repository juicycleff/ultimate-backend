import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../../impl';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  handle(event: UserCreatedEvent): any {
    Logger.log(event, 'UserCreatedEvent'); // write here
  }
}
