import {IQuery} from '@nestjs/cqrs';
import { TenantEntity } from '@ultimatebackend/repository';
import { ReadMemberRequest } from '@ultimatebackend/proto-schema/tenant';

export class GetMemberQuery implements IQuery {
  constructor(
    public readonly where: ReadMemberRequest,
    public readonly tenant: TenantEntity,
  ) {}
}
