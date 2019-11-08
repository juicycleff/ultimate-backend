import { CacheModule, Module } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { EventStore, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { TenantMemberRepository } from '@graphqlcqrs/repository/repositories/tenant-member.repository';
import { TenantMemberResolver } from './tenant-member.resolver';

@Module({
  imports: [
    CqrsModule,
    CacheModule.register(),
    NestjsEventStoreModule.forFeature({
      name: 'tenant-member',
      resolveLinkTos: false,
    }),
  ],
  providers: [TenantMemberResolver, TenantMemberRepository],
})
export class TenantMemberModule {
  constructor(
    // private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit(): any {
    // this.eventStore.setEventHandlers(this.eventHandlers);
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = this.eventStore;
  }
}
