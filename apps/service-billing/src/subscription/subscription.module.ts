import { Module } from '@nestjs/common';
import { SubscriptionResolver } from './subscription.resolver';

@Module({
  providers: [SubscriptionResolver]
})
export class SubscriptionModule {}
