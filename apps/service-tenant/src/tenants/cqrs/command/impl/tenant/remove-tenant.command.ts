import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '@ultimatebackend/repository';
import { DeleteTenantRequest } from '@ultimatebackend/proto-schema/tenant';

export class RemoveTenantCommand implements ICommand {
  constructor(
    public readonly input: DeleteTenantRequest,
    public readonly user: UserEntity,
  ) {}
}
