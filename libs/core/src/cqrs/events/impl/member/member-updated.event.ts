import { IEvent } from '@nestjs/cqrs';
import { TenantMemberEmbed } from '@ultimatebackend/repository';

export class MemberUpdatedEvent implements IEvent {
  constructor(public readonly member: TenantMemberEmbed) {}
}
