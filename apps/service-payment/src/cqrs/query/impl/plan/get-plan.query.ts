import {IQuery} from '@nestjs/cqrs';

export class GetPlanQuery implements IQuery {
  constructor(
    public readonly id: string,
  ) {}
}
