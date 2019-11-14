import { IEvent } from '@nestjs/cqrs';
import { TenantMemberEmbed } from '@graphqlcqrs/repository';

export class TenantMemberCreatedEvent implements IEvent {
  constructor(public readonly tenantMember: TenantMemberEmbed) {}
}
