import { IQuery } from '@nestjs/cqrs';
import { ReadPlanRequest } from '@ultimatebackend/proto-schema/billing';

export class GetPlanQuery implements IQuery {
  constructor(public readonly input: ReadPlanRequest) {}
}
