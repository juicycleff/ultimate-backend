import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccessTokenDeletedEvent } from '../../impl';

@EventsHandler(AccessTokenDeletedEvent)
export class AccessTokenDeletedHandler
  implements IEventHandler<AccessTokenDeletedEvent> {
  handle(event: AccessTokenDeletedEvent): any {
    Logger.log(event, 'AccessTokenDeletedEvent'); // write here
  }
}
