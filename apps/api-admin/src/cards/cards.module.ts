import { Module } from '@nestjs/common';
import { CardsResolver, CardsMutationResolver } from './cards.resolver';
import { BillingsRpcClientService } from '@ultimatebackend/core';

@Module({
  providers: [
    CardsResolver,
    BillingsRpcClientService,
    CardsMutationResolver,
  ],
})
export class CardsModule {}
