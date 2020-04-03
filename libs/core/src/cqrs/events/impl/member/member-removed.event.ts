import { IEvent } from '@nestjs/cqrs';
import { TenantMemberEmbed } from '@ultimatebackend/repository';

export class MemberRemovedEvent implements IEvent {
  constructor(public readonly member: TenantMemberEmbed) {}
}
