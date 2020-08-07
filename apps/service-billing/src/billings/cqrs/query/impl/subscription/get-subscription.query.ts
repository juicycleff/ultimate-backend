import { IQuery } from '@nestjs/cqrs';
import { ReadSubscriptionRequest } from '@ultimatebackend/proto-schema/billing';

export class GetSubscriptionQuery implements IQuery {
  constructor(public readonly input: ReadSubscriptionRequest) {}
}
