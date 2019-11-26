import { CacheModule, Module } from '@nestjs/common';
import { ProjectResolver } from './project.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { ProjectRepository } from '@graphqlcqrs/repository';

@Module({
  imports: [
    CqrsModule,
    CacheModule.register(),
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
