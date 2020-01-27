import { ICommand } from '@nestjs/cqrs';
import { RemoveTenantMemberInput } from '../../../../types';
import { UserEntity } from '@graphqlcqrs/repository';

export class RemoveTenantMemberCommand implements ICommand {
  constructor(
    public readonly input: RemoveTenantMemberInput,
    public readonly user: UserEntity,
  ) {}
}
