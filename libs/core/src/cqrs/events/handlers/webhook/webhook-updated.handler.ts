import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WebhookUpdatedEvent } from '../../impl';

@EventsHandler(WebhookUpdatedEvent)
export class WebhookUpdatedHandler
  implements IEventHandler<WebhookUpdatedEvent> {
  handle(event: WebhookUpdatedEvent): any {
    Logger.log(event, 'WebhookUpdatedEvent'); // write here
  }
}
