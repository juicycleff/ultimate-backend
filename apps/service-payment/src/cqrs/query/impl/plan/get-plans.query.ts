import {IQuery} from '@nestjs/cqrs';
import { PlanFilterInput } from '../../../../types';

export class GetPlansQuery implements IQuery {
  constructor(
    public readonly where?: PlanFilterInput | any,
  ) {}
}
