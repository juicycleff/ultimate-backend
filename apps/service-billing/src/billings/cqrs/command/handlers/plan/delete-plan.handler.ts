import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeletePlanCommand } from '../../impl';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(DeletePlanCommand)
export class DeletePlanHandler implements ICommandHandler<DeletePlanCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeletePlanCommand): Promise<any> {
    // TODO: Tobe implemented
    throw new RpcException('Not implemented');
  }
}
