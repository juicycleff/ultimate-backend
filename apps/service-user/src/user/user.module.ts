import { Module } from '@nestjs/common';
import { EventStore, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs';
import {
  AuthCommandHandlers, AuthEventHandlers,
  UserCommandHandlers,
  UserCreatedEvent,
  UserEventHandlers, UserLoggedInEvent,
  UserQueryHandlers, UserRegisteredEvent,
} from '@graphqlcqrs/core/cqrs';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { RepositoryModule } from '@graphqlcqrs/repository';
import { UserController } from './user.controller';

@Module({
  imports: [
    CqrsModule,
    NestjsEventStoreModule.forFeature({
      name: 'user',
      resolveLinkTos: false,
    }),
    RepositoryModule,
  ],
  providers: [
    UserService,
    UserResolver,
    ...UserQueryHandlers,
    ...UserCommandHandlers,
    ...UserEventHandlers,
    ...AuthCommandHandlers,
    ...AuthEventHandlers,
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {
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
    UserCreatedEvent: (data) => new UserCreatedEvent(data),
    UserRegisteredEvent: (data) => new UserRegisteredEvent(data),
    UserLoggedInEvent: (data) => new UserLoggedInEvent(data),
  };
}
