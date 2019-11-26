import { CacheModule, Module } from '@nestjs/common';
import { CookieSerializer } from '@graphqlcqrs/common';
import { EventStoreSubscriptionType } from '@juicycleff/nestjs-event-store';
import { CqrsModule } from '@nestjs/cqrs';
import { NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { FacebookStrategy, LocalStrategy } from './strategy';
import { AuthController } from './auth.controller';
import {
  AuthCommandHandlers,
  UserLoggedInEvent,
  UserRegisteredEvent,
  AuthEventHandlers,
  EmailVerifiedEvent,
} from '@graphqlcqrs/core';
import { AuthSagas } from './sagas';
import { UserRepository } from '@graphqlcqrs/repository/repositories';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    CacheModule.register(),
    CqrsModule,
    PassportModule,
    NestjsEventStoreModule.forFeature({
      featureStreamName: '$ce-user',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-user',
        },
      ],
      eventHandlers: {
        UserLoggedInEvent: (data) => new UserLoggedInEvent(data),
        UserRegisteredEvent: (data) => new UserRegisteredEvent(data),
        EmailVerifiedEvent: (data) => new EmailVerifiedEvent(data),
      },
    }),
  ],
  providers: [
    AuthSagas,
    AuthService,
    AuthResolver,
    LocalStrategy,
    CookieSerializer,
    ...AuthCommandHandlers,
    ...AuthEventHandlers,
    FacebookStrategy,
    UserRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
