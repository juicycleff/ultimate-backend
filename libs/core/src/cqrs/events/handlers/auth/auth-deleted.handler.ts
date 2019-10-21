import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {AuthDeletedEvent} from '../../impl/auth';

@EventsHandler(AuthDeletedEvent)
export class AuthDeletedHandler implements IEventHandler<AuthDeletedEvent> {
  handle(event: AuthDeletedEvent): any {
    Logger.log(event, 'AuthDeletedEvent'); // write here
  }
}
