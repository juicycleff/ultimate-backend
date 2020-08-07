import { Module } from '@nestjs/common';
import { BillingsResolver } from './billings.resolver';
import { BillingsMutationResolver } from './billings-mutation.resolver';

@Module({
  providers: [BillingsResolver, BillingsMutationResolver],
})
export class BillingsModule {}
