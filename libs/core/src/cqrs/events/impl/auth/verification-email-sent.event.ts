import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from '@graphqlcqrs/repository/entities';

export class VerificationEmailSentEvent implements IEvent {
  constructor(public readonly user: UserEntity) {}
}
