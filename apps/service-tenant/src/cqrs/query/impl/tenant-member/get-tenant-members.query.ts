import {IQuery} from '@nestjs/cqrs';
import { FindConditions } from '@graphqlcqrs/common/helpers/find-condtion.type';
import { TenantMemberEmbed } from '@graphqlcqrs/repository';
import { ObjectID } from 'bson';

export class GetTenantMembersQuery implements IQuery {
  constructor(
    public readonly where: FindConditions<TenantMemberEmbed>,
    public readonly tenantId?: ObjectID | string,
  ) {}
}
