import { ICommand } from '@nestjs/cqrs';
import { TenantEntity, UserEntity } from '@ultimatebackend/repository';
import { DeleteMemberRequest } from '@ultimatebackend/proto-schema/tenant';

export class RemoveMemberCommand implements ICommand {
  constructor(
    public readonly input: DeleteMemberRequest,
    public readonly tenant: TenantEntity,
    public readonly user: UserEntity,
  ) {}
}
