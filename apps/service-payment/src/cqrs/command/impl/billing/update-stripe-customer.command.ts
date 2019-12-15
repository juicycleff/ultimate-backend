import { ICommand } from '@nestjs/cqrs';
import { customers } from 'stripe';

export class UpdateStripeCustomerCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly data: Partial<customers.ICustomerUpdateOptions>,
  ) {}
}
