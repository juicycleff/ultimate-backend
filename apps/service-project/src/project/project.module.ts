import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { RepositoryModule } from '@graphqlcqrs/repository';

@Module({
  imports: [
    CqrsModule,
    NestjsEventStoreModule.forFeature({
      name: 'project',
      resolveLinkTos: false,
    }),
    RepositoryModule,
  ],
  providers: [ProjectService, ProjectResolver],
})
export class ProjectModule {}
