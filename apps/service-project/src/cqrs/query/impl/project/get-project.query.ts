import {IQuery} from '@nestjs/cqrs';
import { ProjectFilterInput } from '../../../../types';

export class GetProjectQuery implements IQuery {
  constructor(
    public readonly where: ProjectFilterInput,
  ) {}
}
