import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ForgotPasswordSentEvent } from '../../impl';

@EventsHandler(ForgotPasswordSentEvent)
export class ForgotPasswordSentHandler
  implements IEventHandler<ForgotPasswordSentEvent> {
  handle(event: ForgotPasswordSentEvent): any {
    Logger.log(event, event.constructor.name);
  }
}
