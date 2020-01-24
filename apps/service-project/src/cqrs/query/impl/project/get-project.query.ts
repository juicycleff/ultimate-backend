import {IQuery} from '@nestjs/cqrs';
import { ProjectFilterInput } from '../../../../types';
import { ProjectRepository } from '@graphqlcqrs/repository';

export class GetProjectQuery implements IQuery {
  constructor(
    public readonly where: ProjectFilterInput,
    public readonly projectRepository: ProjectRepository,
  ) {}
}
