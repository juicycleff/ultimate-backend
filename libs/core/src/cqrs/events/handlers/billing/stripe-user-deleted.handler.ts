import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { StripeUserDeletedEvent } from '../../impl';

@EventsHandler(StripeUserDeletedEvent)
export class StripeUserDeletedHandler
  implements IEventHandler<StripeUserDeletedEvent> {
  handle(event: StripeUserDeletedEvent): any {
    Logger.log(event, 'StripeUserDeletedEvent'); // write here
  }
}
