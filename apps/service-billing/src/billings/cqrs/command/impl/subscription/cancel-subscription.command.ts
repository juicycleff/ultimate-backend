import { ICommand } from '@nestjs/cqrs';
import { CancelSubscriptionRequest } from '@ultimatebackend/proto-schema/billing';

export class CancelSubscriptionCommand implements ICommand {
  constructor(public readonly input: CancelSubscriptionRequest) {}
}
