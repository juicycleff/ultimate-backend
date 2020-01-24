import { ICommand } from '@nestjs/cqrs';
import { UpdateProjectInput } from '../../../../types';
import { ProjectRepository } from '@graphqlcqrs/repository';

export class UpdateProjectCommand implements ICommand {
  constructor(
    public readonly input: UpdateProjectInput,
    public readonly projectRepository: ProjectRepository,
  ) {}
}
