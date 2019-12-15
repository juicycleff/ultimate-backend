import { IEvent } from '@nestjs/cqrs';
import { Customer } from '@graphqlcqrs/core';

export class StripeUserCreatedEvent implements IEvent {
  constructor(
    public readonly customer: Customer,
  ) {}
}
