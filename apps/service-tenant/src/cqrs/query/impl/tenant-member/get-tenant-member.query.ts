import {IQuery} from '@nestjs/cqrs';
import { FindConditions } from '@graphqlcqrs/common/helpers/find-condtion.type';
import { TenantMemberEmbed } from '@graphqlcqrs/repository';

export class GetTenantMemberQuery implements IQuery {
  constructor(
    public readonly where: FindConditions<TenantMemberEmbed>,
  ) {}
}
