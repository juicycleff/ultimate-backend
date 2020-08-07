import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from '@ultimatebackend/repository';

export class UserUpdatedEvent implements IEvent {
  constructor(public readonly user: UserEntity) {}
}
