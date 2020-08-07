import { IEvent } from '@nestjs/cqrs';
import { AccessTokenEntity } from '@ultimatebackend/repository';

export class AccessTokenCreatedEvent implements IEvent {
  constructor(public readonly accessToken: AccessTokenEntity) {}
}
