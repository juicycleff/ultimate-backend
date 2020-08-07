import { IEvent } from '@nestjs/cqrs';
import { Customer } from '../../../../interfaces';

export class StripeUserCreatedEvent implements IEvent {
  constructor(public readonly customer: Customer) {}
}
