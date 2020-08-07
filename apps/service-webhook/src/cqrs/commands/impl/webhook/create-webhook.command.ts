import { ICommand } from '@nestjs/cqrs';
import { CreateWebhookRequest } from '@ultimatebackend/proto-schema/webhook';
import { UserEntity, WebhookRepository } from '@ultimatebackend/repository';

export class CreateWebhookCommand implements ICommand {
  constructor(
    public readonly cmd: CreateWebhookRequest,
    public readonly repo: WebhookRepository,
    public readonly user?: UserEntity,
  ) {}
}
