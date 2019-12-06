import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '@graphqlcqrs/repository';
import { RemoveTenantInput } from '../../../../types';

export class RemoveTenantCommand implements ICommand {
  constructor(
    public readonly user: UserEntity,
    public readonly input: RemoveTenantInput,
  ) {}
}
