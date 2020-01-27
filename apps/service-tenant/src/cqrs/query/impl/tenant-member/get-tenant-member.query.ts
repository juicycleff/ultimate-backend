import {IQuery} from '@nestjs/cqrs';
import { TenantMemberFilterInput } from '../../../../types';
import { ObjectID } from 'mongodb';

export class GetTenantMemberQuery implements IQuery {
  constructor(
    public readonly where: TenantMemberFilterInput,
    public readonly tenantId: ObjectID | string,
  ) {}
}
