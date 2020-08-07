import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SubscriptionCreatedEvent } from '../../impl';

@EventsHandler(SubscriptionCreatedEvent)
export class SubscriptionCreatedHandler
  implements IEventHandler<SubscriptionCreatedEvent> {
  handle(event: SubscriptionCreatedEvent): any {
    Logger.log(event, 'UserCreatedEvent'); // write here
  }
}
