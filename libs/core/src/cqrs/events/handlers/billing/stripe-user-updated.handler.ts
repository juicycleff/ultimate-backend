import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { StripeUserUpdatedEvent } from '../../impl';

@EventsHandler(StripeUserUpdatedEvent)
export class StripeUserUpdatedHandler
  implements IEventHandler<StripeUserUpdatedEvent> {
  handle(event: StripeUserUpdatedEvent): any {
    Logger.log(event, 'StripeUserUpdatedEvent'); // write here
  }
}
