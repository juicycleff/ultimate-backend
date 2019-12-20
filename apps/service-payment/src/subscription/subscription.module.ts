import { Module } from '@nestjs/common';
import { SubscriptionResolver } from './subscription.resolver';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { SubscriptionCommandHandlers } from '../cqrs';
import { SubscriptionController } from './subscription.controller';

@Module({
  imports: [
    NestjsEventStoreModule.forFeature({
      featureStreamName: '$ce-subscription',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-tenant',
        },
      ],
      eventHandlers: null,
    }),
  ],
  providers: [
    ...SubscriptionCommandHandlers,
    SubscriptionResolver,
  ],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
