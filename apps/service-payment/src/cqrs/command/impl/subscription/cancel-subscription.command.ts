import { ICommand } from '@nestjs/cqrs';

export class CancelSubscriptionCommand implements ICommand {
  constructor(
    public readonly identity: {
      tenantId: string,
      customerId: string,
      userId: string,
    },
    public readonly subId?: string,
  ) {}
}
