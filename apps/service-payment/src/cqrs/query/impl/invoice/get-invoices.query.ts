import {IQuery} from '@nestjs/cqrs';

export class GetInvoicesQuery implements IQuery {
  constructor(
    public readonly identity: {
      tenantId: string,
      customerId: string,
      userId: string,
    },
  ) {}
}
