import {IQuery} from '@nestjs/cqrs';
import { ProjectFilterArgs } from '../../../../types';
import { ProjectRepository } from '@graphqlcqrs/repository';

export class GetProjectsQuery implements IQuery {
  constructor(
    public readonly projectRepository: ProjectRepository,
    public readonly input?: ProjectFilterArgs | any,
  ) {}
}
