import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '@ultimatebackend/repository';
import { UpdateTenantRequest } from '@ultimatebackend/proto-schema/tenant';

export class UpdateTenantCommand implements ICommand {
  constructor(
    public readonly input: UpdateTenantRequest,
    public readonly user: UserEntity,
  ) {}
}
