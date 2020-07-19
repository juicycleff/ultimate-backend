import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '@ultimatebackend/repository';
import { UpdateMemberRequest } from '@ultimatebackend/proto-schema/tenant';

export class UpdateMemberCommand implements ICommand {
  constructor(
    public readonly input: UpdateMemberRequest,
    public readonly tenantId: string,
    public readonly user: UserEntity,
  ) {}
}
