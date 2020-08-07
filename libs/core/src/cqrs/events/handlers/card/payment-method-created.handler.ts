import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PaymentMethodAddedEvent } from '../../impl';

@EventsHandler(PaymentMethodAddedEvent)
export class PaymentMethodCreatedHandler
  implements IEventHandler<PaymentMethodAddedEvent> {
  handle(event: PaymentMethodAddedEvent): any {
    Logger.log(event, 'PaymentMethodAddedEvent'); // write here
  }
}
