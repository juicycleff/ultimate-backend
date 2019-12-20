import { Module } from '@nestjs/common';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { TenantRepository } from '@graphqlcqrs/repository/repositories';
import { CookieSerializer } from '@graphqlcqrs/common/providers';
import { TenantCreatedEvent, TenantEventHandlers } from '@graphqlcqrs/core';
import { TenantCommandHandlers } from '../cqrs/command/handlers/tenant';
import { TenantQueryHandlers } from '../cqrs/query/handlers/tenant';
import { TenantResolver } from './tenant.resolver';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

@Module({
  imports: [
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
  controllers: [TenantController, TenantService],
})
export class TenantModule {}
