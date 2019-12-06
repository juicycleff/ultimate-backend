import { ICommand } from '@nestjs/cqrs';
import { InviteTenantMemberInput } from '@ultimatebackend/contracts/services/tenant-contract';

export class InviteTenantMemberCommand implements ICommand {
  constructor(
    public readonly input: InviteTenantMemberInput,
  ) {}
}
