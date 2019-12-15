import { Module } from '@nestjs/common';
import { CardResolver } from './card.resolver';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { AuthEventHandlers, CardEventHandlers, UserRegisteredEvent } from '@graphqlcqrs/core';
import { CardQueryHandlers, CardCommandHandlers } from '../cqrs';

@Module({
  imports: [
    NestjsEventStoreModule.forFeature({
      featureStreamName: '$ce-card',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-card',
        },
      ],
      eventHandlers: {
        UserRegisteredEvent: (data) => new UserRegisteredEvent(data),
      },
    }),
  ],
  providers: [
    ...CardQueryHandlers,
    ...CardEventHandlers,
    ...CardCommandHandlers,
    ...AuthEventHandlers,
    CardResolver,
  ],
})
export class CardModule {}
