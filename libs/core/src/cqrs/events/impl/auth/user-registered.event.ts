import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from '@graphqlcqrs/repository/entities';

export class UserRegisteredEvent implements IEvent {
  constructor(public readonly user: UserEntity) {}
}
