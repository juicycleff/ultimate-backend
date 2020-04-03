import { Module } from '@nestjs/common';
import { AccessTokenController } from './access-token.controller';
import { EventStoreModule, EventStoreSubscriptionType } from '@juicycleff/nestjs-event-store';
import { AccessTokenRepository } from '@ultimatebackend/repository';
import { AccessTokenQueryHandlers } from './cqrs/query/handlers/access-token';
import { AccessTokenCommandHandlers } from './cqrs/commands/handlers/access-token';

@Module({
  imports: [
    EventStoreModule.registerFeature({
      featureStreamName: '$ce-access-token',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-access-token',
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
