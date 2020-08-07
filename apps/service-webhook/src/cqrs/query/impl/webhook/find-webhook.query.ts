import { IQuery } from '@nestjs/cqrs';
import { FindWebhookRequest } from '@ultimatebackend/proto-schema/webhook';
import { WebhookRepository } from '@ultimatebackend/repository';

export class FindWebhookQuery implements IQuery {
  constructor(
    public readonly input: FindWebhookRequest,
    public readonly repo: WebhookRepository,
  ) {}
}
