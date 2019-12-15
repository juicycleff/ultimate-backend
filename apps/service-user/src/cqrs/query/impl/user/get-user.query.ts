import {IQuery} from '@nestjs/cqrs';
import { FindConditions } from '@graphqlcqrs/common/helpers/find-condtion.type';
import { UserEntity } from '@graphqlcqrs/repository';

export class GetUserQuery implements IQuery {
  constructor(
    public readonly where: FindConditions<UserEntity>,
  ) {}
}
