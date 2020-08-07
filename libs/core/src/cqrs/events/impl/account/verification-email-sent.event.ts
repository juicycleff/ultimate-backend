import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from '@ultimatebackend/repository/entities';

export class VerificationEmailSentEvent implements IEvent {
  constructor(public readonly user: UserEntity & { activationLink?: string }) {}
}
