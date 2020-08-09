import { Module } from '@nestjs/common';
import { BillingsController } from './billings.controller';
import { CardsModule } from '../cards/cards.module';
import {
  EventStoreModule,
  EventStoreSubscriptionType,
} from '@juicycleff/nestjs-event-store';
import { PlansModule } from '../plans/plans.module';
import {
  SubscriptionCommandHandlers,
  SubscriptionQueryHandlers,
  PlanCommandHandlers,
  PlanQueryHandlers,
  InvoiceQueryHandlers,
  CustomerCommandHandlers,
} from './cqrs';
import { PlanRepository } from '@ultimatebackend/repository';

@Module({
  imports: [
    EventStoreModule.registerFeature({
      type: 'event-store',
      featureStreamName: '$ce-billing',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-billing',
        },
      ],
      eventHandlers: {},
    }),
    CardsModule,
    PlansModule,
  ],
  controllers: [BillingsController],
  providers: [
    PlanRepository,
    ...CustomerCommandHandlers,
    ...SubscriptionCommandHandlers,
    ...SubscriptionQueryHandlers,
    ...PlanCommandHandlers,
    ...PlanQueryHandlers,
    ...InvoiceQueryHandlers,
  ],
})
export class BillingsModule {}
