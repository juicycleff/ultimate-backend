import {IQuery} from '@nestjs/cqrs';
import { FindConditions } from '@graphqlcqrs/common/helpers/find-condtion.type';
import { TenantEntity, UserEntity } from '@graphqlcqrs/repository';

export class GetTenantQuery implements IQuery {
  constructor(
    public readonly where: FindConditions<TenantEntity>,
    public readonly user?: UserEntity,
  ) {}
}
