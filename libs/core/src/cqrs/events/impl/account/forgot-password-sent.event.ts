import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from '@ultimatebackend/repository/entities';

export class ForgotPasswordSentEvent implements IEvent {
  constructor(
    public readonly user: UserEntity & { resetPasswordLink?: string },
  ) {}
}
