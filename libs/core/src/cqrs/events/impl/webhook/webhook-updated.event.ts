import { IEvent } from '@nestjs/cqrs';
import { WebhookEntity } from '@ultimatebackend/repository';

export class WebhookUpdatedEvent implements IEvent {
  constructor(public readonly webhook: WebhookEntity) {}
}
