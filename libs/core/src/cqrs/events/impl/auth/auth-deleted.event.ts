import { IEvent } from '@nestjs/cqrs';

export class AuthDeletedEvent implements IEvent {
  constructor(
    public readonly authId: string) {}
}
