import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlanRepository } from '@ultimatebackend/repository';

@Module({
  providers: [PlansService, PlanRepository],
  exports: [PlansService],
})
export class PlansModule {}
