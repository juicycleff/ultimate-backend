import { IEvent } from '@nestjs/cqrs';
import { Customer } from '@graphqlcqrs/core';

export class StripeUserUpdatedEvent implements IEvent {
  constructor(
    public readonly customer: Customer) {}
}
