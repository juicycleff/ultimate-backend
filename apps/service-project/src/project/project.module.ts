import { Module } from '@nestjs/common';
import { ProjectResolver } from './project.resolver';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { ProjectRepository } from '@graphqlcqrs/repository';

@Module({
  imports: [
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
  ],
  providers: [ProjectResolver, ProjectRepository],
})
export class ProjectModule {}
