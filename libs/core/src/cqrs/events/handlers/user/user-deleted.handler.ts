import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserDeletedEvent } from '../../impl';

@EventsHandler(UserDeletedEvent)
export class UserDeletedHandler implements IEventHandler<UserDeletedEvent> {
  handle(event: UserDeletedEvent): any {
    Logger.log(event, 'UserCreatedEvent'); // write here
  }
}
