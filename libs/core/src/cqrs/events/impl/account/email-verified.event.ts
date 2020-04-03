import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from '@ultimatebackend/repository/entities';

export class EmailVerifiedEvent implements IEvent {
  constructor(public readonly user: UserEntity) {}
}
