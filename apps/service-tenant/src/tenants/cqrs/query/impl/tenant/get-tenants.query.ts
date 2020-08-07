import { IQuery } from '@nestjs/cqrs';
import { FindTenantRequest } from '@ultimatebackend/proto-schema/tenant';
import { UserEntity } from '@ultimatebackend/repository';

export class GetTenantsQuery implements IQuery {
  constructor(
    public readonly where?: FindTenantRequest,
    public readonly user?: UserEntity,
    public readonly inApp?: boolean,
  ) {}
}
