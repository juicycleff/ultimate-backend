import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {AuthUpdatedEvent} from '../../impl/auth';

@EventsHandler(AuthUpdatedEvent)
export class AuthUpdatedHandler implements IEventHandler<AuthUpdatedEvent> {
  handle(event: AuthUpdatedEvent): any {
    Logger.log(event, 'AuthUpdatedEvent'); // write here
  }
}
