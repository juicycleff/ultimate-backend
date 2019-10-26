import { IEvent } from '@nestjs/cqrs';
import { AuthEntity } from '@graphqlcqrs/repository/entities';

export class AuthUpdatedEvent implements IEvent {
  constructor(
    public readonly auth: AuthEntity) {}
}
