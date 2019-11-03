import { ICommand } from '@nestjs/cqrs';
import { CreateTenantInput } from '@ultimatebackend/contracts/services/tenant-contract';
import { UserEntity } from '@graphqlcqrs/repository/entities';

export class CreateTenantCommand implements ICommand {
  constructor(
    public readonly user: UserEntity,
    public readonly input: CreateTenantInput,
  ) {}
}
