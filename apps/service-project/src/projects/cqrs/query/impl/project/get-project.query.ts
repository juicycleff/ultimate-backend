import { IQuery } from '@nestjs/cqrs';
import { ProjectRepository } from '@ultimatebackend/repository';
import { ReadProjectRequest } from '@ultimatebackend/proto-schema/project';

export class GetProjectQuery implements IQuery {
  constructor(
    public readonly input: ReadProjectRequest,
    public readonly projectRepository: ProjectRepository,
  ) {}
}
