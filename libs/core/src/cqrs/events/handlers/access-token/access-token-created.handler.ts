import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccessTokenCreatedEvent } from '../../impl';

@EventsHandler(AccessTokenCreatedEvent)
export class AccessTokenCreatedHandler
  implements IEventHandler<AccessTokenCreatedEvent> {
  handle(event: AccessTokenCreatedEvent): any {
    Logger.log(event, 'AccessTokenCreatedEvent'); // write here
  }
}
