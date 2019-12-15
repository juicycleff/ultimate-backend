import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import { UserCreatedEvent } from '../../impl/user';

@EventsHandler(UserCreatedEvent)
export class StripeUserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  handle(event: UserCreatedEvent): any {
    Logger.log(event, 'UserCreatedEvent'); // write here
  }
}
