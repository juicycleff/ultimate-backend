import { IEvent } from '@nestjs/cqrs';
import { WebhookEntity } from '@ultimatebackend/repository';

export class WebhookDeletedEvent implements IEvent {
  constructor(public readonly webhook: WebhookEntity) {}
}
