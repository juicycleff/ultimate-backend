import { ICommand } from '@nestjs/cqrs';

export class DeleteStripeCustomerCommand implements ICommand {
  constructor(public readonly id: string) {}
}
