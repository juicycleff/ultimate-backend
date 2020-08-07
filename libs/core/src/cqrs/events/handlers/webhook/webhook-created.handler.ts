import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WebhookCreatedEvent } from '../../impl';

@EventsHandler(WebhookCreatedEvent)
export class WebhookCreatedHandler
  implements IEventHandler<WebhookCreatedEvent> {
  handle(event: WebhookCreatedEvent): any {
    Logger.log(event, 'WebhookCreatedEvent'); // write here
  }
}
