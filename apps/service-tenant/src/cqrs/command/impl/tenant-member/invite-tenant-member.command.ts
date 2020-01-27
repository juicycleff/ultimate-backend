import { ICommand } from '@nestjs/cqrs';
import { InviteTenantMemberInput } from '../../../../types';
import { UserEntity } from '@graphqlcqrs/repository';

export class InviteTenantMemberCommand implements ICommand {
  constructor(
    public readonly input: InviteTenantMemberInput,
    public readonly user: UserEntity,
  ) {}
}
