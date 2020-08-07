import { IQuery } from '@nestjs/cqrs';
import { ReadWebhookRequest } from '@ultimatebackend/proto-schema/webhook';
import { WebhookRepository } from '@ultimatebackend/repository';

export class ReadWebhookQuery implements IQuery {
  constructor(
    public readonly input: ReadWebhookRequest,
    public readonly repo: WebhookRepository,
  ) {}
}
