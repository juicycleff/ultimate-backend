import { Module } from '@nestjs/common';
import { PlansResolver } from './plans.resolver';
import { BillingsRpcClientService } from '@ultimatebackend/core';

@Module({
  providers: [PlansResolver, BillingsRpcClientService],
})
export class PlansModule {}
