import { IEvent } from '@nestjs/cqrs';
import { Customer } from '../../../../interfaces';

export class StripeUserDeletedEvent implements IEvent {
  constructor(public readonly customer: Customer) {}
}
