import { Module } from '@nestjs/common';
import { ProjectResolver } from './project.resolver';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { ProjectRepository } from '@graphqlcqrs/repository';
import { ProjectCommandHandlers } from '../cqrs/command/handlers/project';
import { ProjectQueryHandlers } from '../cqrs/query/handlers/project';
import { ProjectService } from './project.service';

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
  providers: [
    ...ProjectCommandHandlers,
    ...ProjectQueryHandlers,
    ProjectResolver,
    ProjectRepository,
    ProjectService,
  ],
})
export class ProjectModule {}
