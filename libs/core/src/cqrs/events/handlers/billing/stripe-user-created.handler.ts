import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { StripeUserCreatedEvent } from '../../impl';

@EventsHandler(StripeUserCreatedEvent)
export class StripeUserCreatedHandler
  implements IEventHandler<StripeUserCreatedEvent> {
  handle(event: StripeUserCreatedEvent): any {
    Logger.log(event, 'StripeUserCreatedEvent'); // write here
  }
}
