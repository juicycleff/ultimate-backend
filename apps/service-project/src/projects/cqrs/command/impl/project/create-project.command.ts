import { ICommand } from '@nestjs/cqrs';
import { ProjectRepository, UserEntity } from '@ultimatebackend/repository';
import { CreateProjectRequest } from '@ultimatebackend/proto-schema/project';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly input: CreateProjectRequest,
    public readonly user: UserEntity,
    public readonly projectRepository: ProjectRepository,
  ) {}
}
