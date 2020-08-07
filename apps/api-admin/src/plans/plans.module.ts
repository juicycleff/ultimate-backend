import { Module } from '@nestjs/common';
import { PlansResolver } from './plans.resolver';

@Module({
  providers: [PlansResolver],
})
export class PlansModule {}
