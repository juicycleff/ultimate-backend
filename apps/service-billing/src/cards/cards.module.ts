import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';

@Module({
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
