import { IQuery } from '@nestjs/cqrs';
import { TenantAvailableRequest } from '@ultimatebackend/proto-schema/tenant';

export class TenantAvailableQuery implements IQuery {
  constructor(public readonly where: TenantAvailableRequest) {}
}
