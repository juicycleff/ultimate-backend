import {IQuery} from '@nestjs/cqrs';

export class GetSubscriptionQuery implements IQuery {
  constructor(
    public readonly id: string,
  ) {}
}
