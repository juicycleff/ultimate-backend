import { IQuery } from '@nestjs/cqrs';
import { FindMemberRequest } from '@ultimatebackend/proto-schema/tenant';

export class GetMembersQuery implements IQuery {
  constructor(
    public readonly input: FindMemberRequest,
    public readonly tenantId: string,
  ) {}
}
