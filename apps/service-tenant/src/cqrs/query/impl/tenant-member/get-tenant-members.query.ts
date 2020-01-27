import {IQuery} from '@nestjs/cqrs';
import { ObjectID } from 'bson';
import { TenantMemberFilterInput } from '../../../../types';

export class GetTenantMembersQuery implements IQuery {
  constructor(
    public readonly input: TenantMemberFilterInput,
    public readonly tenantId: ObjectID | string,
  ) {}
}
