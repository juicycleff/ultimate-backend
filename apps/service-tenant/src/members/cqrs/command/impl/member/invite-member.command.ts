import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '@ultimatebackend/repository';
import { InviteMemberRequest } from '@ultimatebackend/proto-schema/tenant';

export class InviteMemberCommand implements ICommand {
  constructor(
    public readonly input: InviteMemberRequest,
    public readonly user: UserEntity,
    public readonly tenantId: string,
  ) {}
}
