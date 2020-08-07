import { IQuery } from '@nestjs/cqrs';
import { FindAccessRequest } from '@ultimatebackend/proto-schema/access';

export class FindAccessQuery implements IQuery {
  constructor(public readonly input: FindAccessRequest) {}
}
