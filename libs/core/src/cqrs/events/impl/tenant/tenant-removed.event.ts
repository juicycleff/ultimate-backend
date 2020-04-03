import { IEvent } from '@nestjs/cqrs';
import { TenantEntity } from '@ultimatebackend/repository/entities';

export class TenantRemovedEvent implements IEvent {
  constructor(public readonly tenant: TenantEntity) {}
}
