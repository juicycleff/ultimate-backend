import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '@graphqlcqrs/repository/entities';
import { CreateTenantInput } from '../../../../types';

export class CreateTenantCommand implements ICommand {
  constructor(
    public readonly user: UserEntity,
    public readonly input: CreateTenantInput,
  ) {}
}
