import { Module } from '@nestjs/common';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import {
  UserEventHandlers,
  UserQueryHandlers,
  StripeUserCreatedEvent,
  BillingEventHandlers,
} from '@graphqlcqrs/core';
import { UserRepository } from '@graphqlcqrs/repository';
import { UserResolver } from './user.resolver';
import { UserController } from './user.controller';
import { UserSagas } from './user.sagas';
import { UserCommandHandlers } from '../cqrs';

@Module({
  imports: [
    NestjsEventStoreModule.forFeature({
      featureStreamName: '$ce-user',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-billing',
        },
      ],
      eventHandlers: {
        StripeUserCreatedEvent: (data) => new StripeUserCreatedEvent(data),
      },
    }),
  ],
  providers: [
    UserSagas,
    ...UserQueryHandlers,
    ...UserCommandHandlers,
    ...UserEventHandlers,
    ...BillingEventHandlers,
    UserResolver,
    UserRepository,
  ],
  exports: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
