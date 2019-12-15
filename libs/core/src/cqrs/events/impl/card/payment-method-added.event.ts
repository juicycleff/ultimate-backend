import { IEvent } from '@nestjs/cqrs';
import { CardEntity } from '@graphqlcqrs/repository';

export class PaymentMethodAddedEvent implements IEvent {
  constructor(
    public readonly card: CardEntity) {}
}
