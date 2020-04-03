import { Module } from '@nestjs/common';
import { BillingsResolver } from './billings.resolver';
import { BillingsRpcClientService } from '@ultimatebackend/core';
import { BillingsMutationResolver } from './billings-mutation.resolver';

@Module({
  providers: [
    BillingsResolver,
    BillingsRpcClientService,
    BillingsMutationResolver,
  ],
})
export class BillingsModule {}
