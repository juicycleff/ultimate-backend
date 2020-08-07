import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { WebhookRepository } from '@ultimatebackend/repository';
import { RpcException } from '@nestjs/microservices';
import { DeleteWebhookResponse } from '@ultimatebackend/proto-schema/webhook';
import { DeleteWebhookCommand } from '../../';
import { WebhookDeletedEvent } from '@ultimatebackend/core';
import { mapWebhookEntityToProto } from '../../../../utitlity';

/**
 * @implements {ICommandHandler<DeleteWebhookCommand>}
 * @classdesc CQRS command to request webhook deletion
 * @class
 */
@CommandHandler(DeleteWebhookCommand)
export class DeleteWebhookHandler
  implements ICommandHandler<DeleteWebhookCommand> {
  logger = new Logger(this.constructor.name);
  repo: WebhookRepository;

  /**
   * @constructor
   * @param tokenRepository
   * @param eventBus
   * @param accessEnforcer
   */
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: DeleteWebhookCommand): Promise<DeleteWebhookResponse> {
    this.logger.log(`Async ${command.constructor.name}...`);
    const { cmd } = command;
    this.repo = command.repo;

    try {
      const rsp = await this.repo.findOne({
        _id: cmd.id,
      });

      if (!rsp) {
        throw new RpcException('Access token by id not found');
      }

      await this.repo.deleteOneById(rsp.id.toString());

      /*  Publish to the event store of our newly created access token */
      await this.eventBus.publish(new WebhookDeletedEvent(rsp));

      return {
        webhook: mapWebhookEntityToProto(rsp),
      };
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
