import {IQuery} from '@nestjs/cqrs';
import { FindConditions } from '@graphqlcqrs/common/helpers/find-condtion.type';
import { TenantEntity } from '@graphqlcqrs/repository';

export class GetTenantsQuery implements IQuery {
  constructor(
    public readonly where: FindConditions<TenantEntity> | any,
  ) {}
}
