import {IQuery} from '@nestjs/cqrs';
import { AuthEntity } from '@graphqlcqrs/repository';
import { FindConditions } from '@graphqlcqrs/common/helpers/find-condtion.type';

export class GetAuthQuery implements IQuery {
  constructor(
    public readonly where: FindConditions<AuthEntity>,
  ) {}
}
