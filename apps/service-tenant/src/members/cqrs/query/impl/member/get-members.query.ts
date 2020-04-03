import {IQuery} from '@nestjs/cqrs';
import { FindMemberRequest } from '@ultimatebackend/proto-schema/tenant';
import { TenantEntity } from '@ultimatebackend/repository';

export class GetMembersQuery implements IQuery {
  constructor(
    public readonly input: FindMemberRequest,
    public readonly tenant: TenantEntity,
  ) {}
}
