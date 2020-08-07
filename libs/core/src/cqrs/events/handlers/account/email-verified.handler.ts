import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailVerifiedEvent } from '../../impl';

@EventsHandler(EmailVerifiedEvent)
export class EmailVerifiedHandler implements IEventHandler<EmailVerifiedEvent> {
  handle(event: EmailVerifiedEvent): any {
    Logger.log(event, 'EmailVerifiedEvent');
  }
}
