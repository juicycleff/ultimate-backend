import { ICommand } from '@nestjs/cqrs';
import { CreateSubscriptionRequest } from '@ultimatebackend/proto-schema/billing';

export class CreateSubscriptionCommand implements ICommand {
  constructor(
    public readonly input: CreateSubscriptionRequest, // public readonly input: { planId?: string, couponId?: string },
  ) {}
}
