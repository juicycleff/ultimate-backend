import { IEvent } from '@nestjs/cqrs';
import {AuthEntity} from '../../../../data/entities';

export class AuthUpdatedEvent implements IEvent {
  constructor(
    public readonly auth: AuthEntity) {}
}
