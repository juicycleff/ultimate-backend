import {IQuery} from '@nestjs/cqrs';
import { ProjectFilterArgs } from '../../../../types';

export class GetProjectsQuery implements IQuery {
  constructor(
    public readonly input?: ProjectFilterArgs | any,
  ) {}
}
