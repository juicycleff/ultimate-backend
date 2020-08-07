import { IQuery } from '@nestjs/cqrs';
import { ReadMemberRequest } from '@ultimatebackend/proto-schema/tenant';

export class GetMemberQuery implements IQuery {
  constructor(
    public readonly where: ReadMemberRequest,
    public readonly tenantId: string,
  ) {}
}
