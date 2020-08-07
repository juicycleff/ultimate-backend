import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SubscriptionChangedEvent } from '../../impl';

@EventsHandler(SubscriptionChangedEvent)
export class SubscriptionChangedHandler
  implements IEventHandler<SubscriptionChangedEvent> {
  handle(event: SubscriptionChangedEvent): any {
    Logger.log(event, event.constructor.name); // write here
  }
}
