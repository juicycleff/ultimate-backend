import { ICommand } from '@nestjs/cqrs';
import { ChangeSubscriptionRequest } from '@ultimatebackend/proto-schema/billing';

export class ChangeSubscriptionCommand implements ICommand {
  constructor(public readonly input: ChangeSubscriptionRequest) {}
}
