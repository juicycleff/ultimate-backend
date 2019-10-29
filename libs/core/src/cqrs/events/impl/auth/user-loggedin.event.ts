import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from '@graphqlcqrs/repository/entities';

export class UserLoggedInEvent implements IEvent {
  constructor(public readonly user: UserEntity) {}
}
