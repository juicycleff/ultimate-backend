import { Module } from '@nestjs/common';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { TenantCreatedEvent } from '@graphqlcqrs/core';
import { PlanResolver } from './plan.resolver';
import { PlanController } from './plan.controller';
import { PlanSeed } from './plan.seed';
import { PlanQueryHandlers } from '../cqrs';

@Module({
  imports: [
    NestjsEventStoreModule.forFeature({
      featureStreamName: '$ce-plan',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-plan',
        },
      ],
      eventHandlers: {
        TenantCreatedEvent: (data) => new TenantCreatedEvent(data),
      },
    }),
  ],
  providers: [
    PlanResolver,
    ...PlanQueryHandlers,
    PlanSeed,
  ],
  controllers: [PlanController],
})
export class PlanModule {}
