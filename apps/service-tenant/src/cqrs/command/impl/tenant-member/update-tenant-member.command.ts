import { ICommand } from '@nestjs/cqrs';
import { UpdateTenantMemberInput } from '../../../../types';
import { UserEntity } from '@graphqlcqrs/repository';

export class UpdateTenantMemberCommand implements ICommand {
  constructor(
    public readonly input: UpdateTenantMemberInput,
    public readonly user: UserEntity,
  ) {}
}
