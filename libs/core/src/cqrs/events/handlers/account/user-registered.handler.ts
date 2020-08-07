import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../../impl';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler
  implements IEventHandler<UserRegisteredEvent> {
  handle(event: UserRegisteredEvent): any {
    Logger.log(event, 'UserRegisteredEvent');
  }
}
