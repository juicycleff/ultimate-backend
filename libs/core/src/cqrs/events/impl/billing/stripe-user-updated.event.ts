import { IEvent } from '@nestjs/cqrs';
import { Customer } from '../../../../interfaces';

export class StripeUserUpdatedEvent implements IEvent {
  constructor(public readonly customer: Customer) {}
}
