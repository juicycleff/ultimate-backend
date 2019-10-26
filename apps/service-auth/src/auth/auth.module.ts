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
  AuthCreatedEvent,
  AuthEventHandlers,
  AuthQueryHandlers,
  UserCommandHandlers,
  UserCreatedEvent,
  UserEventHandlers,
  UserQueryHandlers,
} from '@graphqlcqrs/core';
import { AuthSagas } from './sagas';

@Module({
  imports: [
    RepositoryModule,
    CqrsModule,
    NestjsEventStoreModule.forFeature({
      name: 'auth',
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
    ...AuthQueryHandlers,
    ...AuthEventHandlers,
    ...UserQueryHandlers,
    ...UserCommandHandlers,
    ...UserEventHandlers,
    FacebookStrategy,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    AuthResolver,
    LocalStrategy,
    CookieSerializer,
    ...AuthCommandHandlers,
    ...AuthQueryHandlers,
    ...AuthEventHandlers,
    ...UserQueryHandlers,
    ...UserCommandHandlers,
    ...UserEventHandlers,
    FacebookStrategy,
  ],
})
export class AuthModule {
  constructor(
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly authSagas: AuthSagas,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit(): any {
    this.eventStore.setEventHandlers(this.eventHandlers);
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = this.eventStore;
    this.event$.registerSagas([AuthSagas]);
  }

  eventHandlers = {
    AuthCreatedEvent: (data) => new AuthCreatedEvent(data),
    UserCreatedEvent: (data) => new UserCreatedEvent(data),
  };
}
