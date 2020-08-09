import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import {
  EventStoreModule,
  EventStoreSubscriptionType,
} from '@juicycleff/nestjs-event-store';
import { WebhookEventHandlers } from '@ultimatebackend/core';
import { WebhookCommandHandlers, WebhookQueryHandlers } from '../cqrs';
import { WebhookRepository } from '@ultimatebackend/repository';

@Module({
  imports: [
    EventStoreModule.registerFeature({
      type: 'event-store',
      featureStreamName: '$ce-webhook',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-webhook',
        },
      ],
      eventHandlers: null,
    }),
  ],
  providers: [
    ...WebhookEventHandlers,
    ...WebhookQueryHandlers,
    ...WebhookCommandHandlers,
    WebhookRepository,
  ],
  controllers: [WebhookController],
})
export class WebhookModule {}
