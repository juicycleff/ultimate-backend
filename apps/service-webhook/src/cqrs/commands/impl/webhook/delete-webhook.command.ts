import { ICommand } from '@nestjs/cqrs';
import { DeleteWebhookRequest } from '@ultimatebackend/proto-schema/webhook';
import { WebhookRepository } from '@ultimatebackend/repository';

export class DeleteWebhookCommand implements ICommand {
  constructor(
    public readonly cmd: DeleteWebhookRequest,
    public readonly repo: WebhookRepository,
  ) {}
}
