import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { CreatePlanCommand } from '../../impl';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(CreatePlanCommand)
export class CreatePlanHandler implements ICommandHandler<CreatePlanCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreatePlanCommand): Promise<any> {
    // TODO: Tobe implemented
    throw new RpcException('Not implemented');
  }
}
