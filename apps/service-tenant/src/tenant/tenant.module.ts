import { CacheModule, Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { EventStore, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { TenantRepository } from '@graphqlcqrs/repository/repositories';
import { CookieSerializer } from '@graphqlcqrs/common/providers';
import { TenantCreatedEvent, TenantEventHandlers } from '@graphqlcqrs/core';
import { TenantCommandHandlers } from '../cqrs/command/handlers/tenant';
import { TenantQueryHandlers } from '../cqrs/query/handlers/tenant';
import { TenantResolver } from './tenant.resolver';

@Module({
  imports: [
    CqrsModule,
    CacheModule.register(),
    NestjsEventStoreModule.forFeature({
      name: 'tenant',
      resolveLinkTos: false,
    }),
  ],
  providers: [
    TenantResolver,
    TenantRepository,
    CookieSerializer,
    ...TenantCommandHandlers,
    ...TenantEventHandlers,
    ...TenantQueryHandlers,
  ],
})
export class TenantModule implements OnModuleInit {
  constructor(
    private readonly event$: EventBus,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit(): any {
    this.eventStore.setEventHandlers(this.eventHandlers);
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = this.eventStore;
  }

  eventHandlers = {
    TenantCreatedEvent: (data) => new TenantCreatedEvent(data),
  };
}
