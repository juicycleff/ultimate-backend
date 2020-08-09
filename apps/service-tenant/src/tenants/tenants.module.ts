import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import {
  EventStoreSubscriptionType,
  EventStoreModule,
} from '@juicycleff/nestjs-event-store';
import {
  BillingsRpcClientService,
  RolesRpcClientService,
  TenantCreatedEvent,
  TenantEventHandlers,
} from '@ultimatebackend/core';
import { TenantRepository } from '@ultimatebackend/repository';
import { TenantCommandHandlers, TenantQueryHandlers } from './cqrs';
import { TenantSagas } from './sagas';

@Module({
  imports: [
    EventStoreModule.registerFeature({
      featureStreamName: '$ce-tenant',
      type: 'event-store',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-tenant',
        },
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-point',
        },
      ],
      eventHandlers: {
        TenantCreatedEvent: (data) => new TenantCreatedEvent(data),
      },
    }),
  ],
  providers: [
    TenantRepository,
    BillingsRpcClientService,
    RolesRpcClientService,
    ...TenantCommandHandlers,
    ...TenantEventHandlers,
    ...TenantQueryHandlers,
    TenantSagas,
  ],
  controllers: [TenantsController],
})
export class TenantsModule {}
