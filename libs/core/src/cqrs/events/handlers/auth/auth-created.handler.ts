import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {AuthCreatedEvent} from '../../impl/auth';

@EventsHandler(AuthCreatedEvent)
export class AuthCreatedHandler implements IEventHandler<AuthCreatedEvent> {
  handle(event: AuthCreatedEvent): any {
    Logger.log(event, 'AuthCreatedEvent'); // write here
  }
}
