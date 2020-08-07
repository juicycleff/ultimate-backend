import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePlanCommand } from '../../impl';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { CreatePlanResponse } from '@ultimatebackend/proto-schema/billing';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(UpdatePlanCommand)
export class UpdatePlanHandler implements ICommandHandler<UpdatePlanCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdatePlanCommand): Promise<CreatePlanResponse> {
    // TODO: Tobe implemented
    throw new RpcException('Not implemented');
  }
}
