import { CacheModule, Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { EventStore, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { TenantResolver } from './tenant.resolver';
import { TenantRepository } from '@graphqlcqrs/repository/repositories';
import { CookieSerializer } from '@graphqlcqrs/common/providers';

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
  ],
})
export class TenantModule implements OnModuleInit {
  constructor(
    private readonly event$: EventBus,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit(): any {
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = this.eventStore;
  }
}
