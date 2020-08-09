import { Module } from '@nestjs/common';
import { AccessTokenController } from './access-token.controller';
import {
  EventStoreModule,
  EventStoreSubscriptionType,
} from '@juicycleff/nestjs-event-store';
import { AccessTokenRepository } from '@ultimatebackend/repository';
import { AccessTokenQueryHandlers } from './cqrs/query/handlers/access-token';
import { AccessTokenCommandHandlers } from './cqrs/commands/handlers/access-token';

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
      eventHandlers: {},
    }),
  ],
  controllers: [AccessTokenController],
  providers: [
    AccessTokenRepository,
    ...AccessTokenQueryHandlers,
    ...AccessTokenCommandHandlers,
  ],
})
export class AccessTokenModule {}
