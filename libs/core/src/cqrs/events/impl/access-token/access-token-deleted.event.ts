import { IEvent } from '@nestjs/cqrs';
import { AccessTokenEntity } from '@ultimatebackend/repository';

export class AccessTokenDeletedEvent implements IEvent {
  constructor(public readonly accessToken: AccessTokenEntity) {}
}
