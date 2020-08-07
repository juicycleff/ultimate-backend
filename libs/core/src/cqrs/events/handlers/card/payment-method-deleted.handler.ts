import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PaymentMethodDeletedEvent } from '../../impl';

@EventsHandler(PaymentMethodDeletedEvent)
export class PaymentMethodDeletedHandler
  implements IEventHandler<PaymentMethodDeletedEvent> {
  handle(event: PaymentMethodDeletedEvent): any {
    Logger.log(event, 'PaymentMethodDeletedEvent'); // write here
  }
}
