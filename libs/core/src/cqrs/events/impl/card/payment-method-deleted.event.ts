import { IEvent } from '@nestjs/cqrs';
import { CardEntity } from '@graphqlcqrs/repository';

export class PaymentMethodDeletedEvent implements IEvent {
  constructor(
    public readonly card: CardEntity) {}
}
