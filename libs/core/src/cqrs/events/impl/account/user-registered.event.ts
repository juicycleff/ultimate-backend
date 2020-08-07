import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from '@ultimatebackend/repository/entities';

export class UserRegisteredEvent implements IEvent {
  constructor(
    public readonly user: UserEntity & {
      activationLink?: string;
      service?: 'social' | 'local';
    },
  ) {}
}
