import { ICommand } from '@nestjs/cqrs';
import { TenantEntity, UserEntity } from '@ultimatebackend/repository';
import { UpdateMemberRequest } from '@ultimatebackend/proto-schema/tenant';

export class UpdateMemberCommand implements ICommand {
  constructor(
    public readonly input: UpdateMemberRequest,
    public readonly tenant: TenantEntity,
    public readonly user: UserEntity,
  ) {}
}
