import { Module } from '@nestjs/common';
import { CookieSerializer } from '@graphqlcqrs/common';
import { EventStoreSubscriptionType } from '@juicycleff/nestjs-event-store';
import { NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { FacebookStrategy, LocalStrategy } from './strategy';
import {
  UserLoggedInEvent,
  UserRegisteredEvent,
  AuthEventHandlers,
  EmailVerifiedEvent,
} from '@graphqlcqrs/core';
import {
  AuthCommandHandlers,
} from '../cqrs';
import { AuthSagas } from './sagas';
import { UserRepository } from '@graphqlcqrs/repository/repositories';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
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
})
export class AuthModule {}
