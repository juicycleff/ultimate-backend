import { ICommand } from '@nestjs/cqrs';
import { ProjectRepository, UserEntity } from '@ultimatebackend/repository';
import { UpdateProjectRequest } from '@ultimatebackend/proto-schema/project';

export class UpdateProjectCommand implements ICommand {
  constructor(
    public readonly input: UpdateProjectRequest,
    public readonly user: UserEntity,
    public readonly projectRepository: ProjectRepository,
  ) {}
}
