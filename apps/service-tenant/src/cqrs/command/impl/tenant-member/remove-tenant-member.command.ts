import { ICommand } from '@nestjs/cqrs';
import { RemoveTenantInput } from '../../../../types';

export class RemoveTenantMemberCommand implements ICommand {
  constructor(
    public readonly input: RemoveTenantInput,
  ) {}
}
