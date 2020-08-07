import { Module } from '@nestjs/common';
import { CardsResolver, CardsMutationResolver } from './cards.resolver';

@Module({
  providers: [CardsResolver, CardsMutationResolver],
})
export class CardsModule {}
