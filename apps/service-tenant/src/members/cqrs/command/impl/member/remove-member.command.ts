import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '@ultimatebackend/repository';
import { DeleteMemberRequest } from '@ultimatebackend/proto-schema/tenant';

export class RemoveMemberCommand implements ICommand {
  constructor(
    public readonly input: DeleteMemberRequest,
    public readonly tenantId: string,
    public readonly user: UserEntity,
  ) {}
}
