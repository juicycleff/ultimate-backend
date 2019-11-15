import { CacheModule, Module } from '@nestjs/common';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { CqrsModule } from '@nestjs/cqrs';
import {
  AuthCommandHandlers, AuthEventHandlers,
  UserCommandHandlers,
  UserCreatedEvent,
  UserEventHandlers, UserLoggedInEvent,
  UserQueryHandlers, UserRegisteredEvent,
} from '@graphqlcqrs/core/cqrs';
import { UserRepository } from '@graphqlcqrs/repository';
import { UserResolver } from './user.resolver';
import { UserController } from './user.controller';

@Module({
  imports: [
    CqrsModule,
    NestjsEventStoreModule.forFeature({
      featureStreamName: '$ce-user',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-user',
        },
      ],
      eventHandlers: {
        UserCreatedEvent: (data) => new UserCreatedEvent(data),
        UserRegisteredEvent: (data) => new UserRegisteredEvent(data),
        UserLoggedInEvent: (data) => new UserLoggedInEvent(data),
      },
    }),
    CacheModule.register(),
  ],
  providers: [
    UserResolver,
    ...UserQueryHandlers,
    ...UserCommandHandlers,
    ...UserEventHandlers,
    ...AuthCommandHandlers,
    ...AuthEventHandlers,
    UserRepository,
  ],
  exports: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
