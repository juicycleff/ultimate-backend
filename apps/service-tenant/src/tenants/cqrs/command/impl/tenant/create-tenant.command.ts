import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '@ultimatebackend/repository/entities';
import { CreateTenantRequest } from '@ultimatebackend/proto-schema/tenant';

export class CreateTenantCommand implements ICommand {
  constructor(
    public readonly input: CreateTenantRequest,
    public readonly user: UserEntity,
  ) {}
}
