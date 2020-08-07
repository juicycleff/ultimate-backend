import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WebhookDeletedEvent } from '../../impl';

@EventsHandler(WebhookDeletedEvent)
export class WebhookDeletedHandler
  implements IEventHandler<WebhookDeletedEvent> {
  handle(event: WebhookDeletedEvent): any {
    Logger.log(event, 'WebhookDeletedEvent'); // write here
  }
}
