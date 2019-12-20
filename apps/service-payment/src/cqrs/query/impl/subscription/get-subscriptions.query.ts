import {IQuery} from '@nestjs/cqrs';

export class GetSubscriptionsQuery implements IQuery {
  constructor(
    public readonly identity: {
      tenantId: string,
      customerId: string,
      userId: string,
    },
  ) {}
}
