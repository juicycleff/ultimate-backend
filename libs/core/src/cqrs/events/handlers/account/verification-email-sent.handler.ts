import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { VerificationEmailSentEvent } from '../../impl';

@EventsHandler(VerificationEmailSentEvent)
export class VerificationEmailSentHandler
  implements IEventHandler<VerificationEmailSentEvent> {
  handle(event: VerificationEmailSentEvent): any {
    Logger.log(event, event.constructor.name);
  }
}
