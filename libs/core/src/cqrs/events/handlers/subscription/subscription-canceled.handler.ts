import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SubscriptionCanceledEvent } from '../../impl';

@EventsHandler(SubscriptionCanceledEvent)
export class SubscriptionCanceledHandler
  implements IEventHandler<SubscriptionCanceledEvent> {
  handle(event: SubscriptionCanceledEvent): any {
    Logger.log(event, event.constructor.name); // write here
  }
}
