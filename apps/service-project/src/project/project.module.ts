import { Module } from '@nestjs/common';
import { ProjectResolver } from './project.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { RepositoryModule } from '@graphqlcqrs/repository';

@Module({
  imports: [
    CqrsModule,
    NestjsEventStoreModule.forFeature({
      featureStreamName: '$ce-project',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.CatchUp,
          stream: '$ce-project',
        },
      ],
      eventHandlers: null,
    }),
    RepositoryModule,
  ],
  providers: [ProjectResolver],
})
export class ProjectModule {}
