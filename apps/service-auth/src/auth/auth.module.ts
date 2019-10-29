import { Module } from '@nestjs/common';
import { CookieSerializer } from '@graphqlcqrs/common';
import { RepositoryModule } from '@graphqlcqrs/repository/repository.module';
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
} from '@graphqlcqrs/core';
import { AuthSagas } from './sagas';

@Module({
  imports: [
    RepositoryModule,
    CqrsModule,
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
  };
}
