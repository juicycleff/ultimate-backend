import { CacheModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
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
      featureStreamName: '$ce-tenant',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-tenant',
        },
      ],
      eventHandlers: {
        TenantCreatedEvent: (data) => new TenantCreatedEvent(data),
      },
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
export class TenantModule {}
