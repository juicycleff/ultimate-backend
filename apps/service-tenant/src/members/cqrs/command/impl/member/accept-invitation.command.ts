import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '@ultimatebackend/repository';
import { AcceptMemberInvitationRequest } from '@ultimatebackend/proto-schema/tenant';

export class AcceptInvitationCommand implements ICommand {
  constructor(
    public readonly input: AcceptMemberInvitationRequest,
    public readonly user: UserEntity,
  ) {}
}
