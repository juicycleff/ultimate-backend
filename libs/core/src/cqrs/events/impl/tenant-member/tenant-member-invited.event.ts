import { IEvent } from '@nestjs/cqrs';
import { TenantMemberEmbed } from '@graphqlcqrs/repository';

export class TenantMemberInvitedEvent implements IEvent {
  constructor(public readonly tenantMember: TenantMemberEmbed) {}
}
