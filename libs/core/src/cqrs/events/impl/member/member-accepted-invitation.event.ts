import { IEvent } from '@nestjs/cqrs';
import { TenantMemberEmbed } from '@ultimatebackend/repository';

export class MemberAcceptedInvitationEvent implements IEvent {
  constructor(public readonly member: TenantMemberEmbed) {}
}
