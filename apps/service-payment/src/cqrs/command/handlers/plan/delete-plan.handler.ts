import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { PlanEntity } from '@graphqlcqrs/repository';
import { PlanDeletedEvent } from '@graphqlcqrs/core';
import { ConflictError } from '@graphqlcqrs/common';
import { DeletePlanCommand } from '../../impl';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { Plan } from '../../../../types';
import { convertToPlan } from '../../../../converter.util';

@CommandHandler(DeletePlanCommand)
export class DeletePlanHandler implements ICommandHandler<DeletePlanCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeletePlanCommand): Promise<Plan> {
    this.logger.log(`Async ${this.constructor.name}...`);
    const { input } = command;

    try {
      if (input.id === null) { // Check to make sure input is not null
        throw new UserInputError('Plan id is missing'); // Throw an apollo input error
      }

      const product = await this.stripeClient.products.retrieve(input.id);
      if (!product) {
        throw new ConflictError('Plan with ID does not exist');
      }

      const plans = await this.stripeClient.plans.list({
        product: input.id,
      });
      const plan = convertToPlan(plans, product);

      if (plans.data && plans.data.length > 0) {
        for (const p of plans.data) {
          await this.stripeClient.plans.del(p.id);
        }
      }

      // @ts-ignore
      const eventData: PlanEntity = { ...plan };
      await this.stripeClient.products.del(input.id);
      await this.eventBus.publish(new PlanDeletedEvent(eventData));

      return plan;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }

}
