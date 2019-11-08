import { CacheModule, Module } from '@nestjs/common';
import { CookieSerializer } from '@graphqlcqrs/common';
import { EventStore } from '@juicycleff/nestjs-event-store';
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs';
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
      name: 'user',
      resolveLinkTos: false,
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
export class AuthModule {
  constructor(
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit(): any {
    this.eventStore.setEventHandlers(this.eventHandlers);
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = this.eventStore;
  }

  eventHandlers = {
    UserLoggedInEvent: (data) => new UserLoggedInEvent(data),
    UserRegisteredEvent: (data) => new UserRegisteredEvent(data),
    EmailVerifiedEvent: (data) => new EmailVerifiedEvent(data),
  };
}
