import { ICommand } from '@nestjs/cqrs';

export class CreateSubscriptionCommand implements ICommand {
  constructor(
    public readonly identity: {
      tenantId: string,
      customerId: string,
      userId: string,
    },
    public readonly input: { planId?: string, couponId?: string },
  ) {}
}
