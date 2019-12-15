import { Module } from '@nestjs/common';
import { BillingResolver } from './billing.resolver';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { UserRegisteredEvent, BillingEventHandlers, AuthEventHandlers } from '@graphqlcqrs/core';
import { BillingCommandHandlers } from '../cqrs';
import { BillingSagas } from './billing.sagas';

@Module({
  imports: [
    NestjsEventStoreModule.forFeature({
      featureStreamName: '$ce-billing',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-billing',
        },
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-user',
        },
      ],
      eventHandlers: {
        UserRegisteredEvent: (data) => new UserRegisteredEvent(data),
      },
    }),
  ],
  providers: [
    ...BillingCommandHandlers,
    ...BillingEventHandlers,
    ...AuthEventHandlers,
    BillingSagas,
    BillingResolver,
  ],
})
export class BillingModule {}
