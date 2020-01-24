import { ICommand } from '@nestjs/cqrs';
import { CreateProjectInput } from '../../../../types';
import { ProjectRepository } from '@graphqlcqrs/repository';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly input: CreateProjectInput,
    public readonly projectRepository: ProjectRepository,
  ) {}
}
