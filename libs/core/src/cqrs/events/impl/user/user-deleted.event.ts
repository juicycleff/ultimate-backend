import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from '@graphqlcqrs/repository';

export class UserDeletedEvent implements IEvent {
  constructor(
    public readonly user: UserEntity) {}
}
