import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PaymentMethodUpdatedEvent } from '../../impl';

@EventsHandler(PaymentMethodUpdatedEvent)
export class PaymentMethodUpdatedHandler
  implements IEventHandler<PaymentMethodUpdatedEvent> {
  handle(event: PaymentMethodUpdatedEvent): any {
    Logger.log(event, 'PaymentMethodUpdatedEvent'); // write here
  }
}
