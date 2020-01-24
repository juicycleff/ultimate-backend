import { ICommand } from '@nestjs/cqrs';
import { DeleteProjectInput } from '../../../../types';
import { ProjectRepository } from '@graphqlcqrs/repository';

export class DeleteProjectCommand implements ICommand {
  constructor(
    public readonly input: DeleteProjectInput,
    public readonly projectRepository: ProjectRepository,
  ) {}
}
