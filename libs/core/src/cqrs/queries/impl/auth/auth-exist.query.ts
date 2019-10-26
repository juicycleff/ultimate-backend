import {IQuery} from '@nestjs/cqrs';
import { AuthEntity } from '@graphqlcqrs/repository/entities';
import { FindConditions } from '@graphqlcqrs/common/helpers/find-condtion.type';

export class AuthExistQuery implements IQuery {
  constructor(
    public readonly where: FindConditions<AuthEntity>) {}
}
