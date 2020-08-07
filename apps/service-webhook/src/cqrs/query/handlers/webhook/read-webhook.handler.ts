import { CACHE_MANAGER, CacheStore, Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReadWebhookResponse } from '@ultimatebackend/proto-schema/webhook';
import { RpcException } from '@nestjs/microservices';
import { ReadWebhookQuery } from '../../impl';
import { WebhookRepository } from '@ultimatebackend/repository';
import { mapWebhookEntityToProto } from '../../../../utitlity';

@QueryHandler(ReadWebhookQuery)
export class ReadWebhookHandler implements IQueryHandler<ReadWebhookQuery> {
  logger = new Logger(this.constructor.name);
  repo: WebhookRepository;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore) {}

  async execute(query: ReadWebhookQuery): Promise<ReadWebhookResponse> {
    this.logger.log(`Async ${query.constructor.name}`); // write here
    const { input } = query;
    this.repo = query.repo;

    if (!input.id) {
      throw new RpcException('Missing webhook id missing');
    }

    try {
      const webhook = await this.repo.findById(input.id);
      if (!webhook) {
        throw new RpcException('Webhook by filter not found');
      }

      return {
        webhook: mapWebhookEntityToProto(webhook),
      };
    } catch (e) {
      this.logger.error(e);
      throw new RpcException(e);
    }
  }
}
