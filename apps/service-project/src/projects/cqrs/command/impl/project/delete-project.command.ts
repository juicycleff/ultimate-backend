import { ICommand } from '@nestjs/cqrs';
import { ProjectRepository, UserEntity } from '@ultimatebackend/repository';
import { DeleteProjectRequest } from '@ultimatebackend/proto-schema/project';

export class DeleteProjectCommand implements ICommand {
  constructor(
    public readonly input: DeleteProjectRequest,
    public readonly user: UserEntity,
    public readonly projectRepository: ProjectRepository,
  ) {}
}
