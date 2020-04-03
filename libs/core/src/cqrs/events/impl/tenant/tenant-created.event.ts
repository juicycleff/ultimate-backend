import { IEvent } from '@nestjs/cqrs';
import { TenantEntity } from '@ultimatebackend/repository/entities';

export class TenantCreatedEvent implements IEvent {
  constructor(public readonly tenant: TenantEntity) {}
}
