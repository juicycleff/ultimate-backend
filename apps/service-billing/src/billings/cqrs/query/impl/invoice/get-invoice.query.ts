import { IQuery } from '@nestjs/cqrs';

export class GetInvoiceQuery implements IQuery {
  constructor(public readonly id: string) {}
}
