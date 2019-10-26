import { IEvent } from '@nestjs/cqrs';
import { AuthEntity } from '@graphqlcqrs/repository/entities';

export class AuthCreatedEvent implements IEvent {
  constructor(
    public readonly auth: AuthEntity) {}
}
