import { IEvent } from '@nestjs/cqrs';
import { TenantMemberEmbed } from '@ultimatebackend/repository';

export class MemberInvitedEvent implements IEvent {
  constructor(public readonly member: TenantMemberEmbed & { token?: string }) {}
}
