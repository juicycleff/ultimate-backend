import { IQuery } from '@nestjs/cqrs';
import { ProjectRepository } from '@ultimatebackend/repository';
import { FindProjectsRequest } from '@ultimatebackend/proto-schema/project';

export class GetProjectsQuery implements IQuery {
  constructor(
    public readonly projectRepository: ProjectRepository,
    public readonly input?: FindProjectsRequest,
  ) {}
}
