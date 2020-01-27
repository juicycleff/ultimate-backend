import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { PlanEntity } from '@graphqlcqrs/repository';
import { PlanUpdatedEvent } from '@graphqlcqrs/core';
import { ConflictError } from '@graphqlcqrs/common';
import { UpdatePlanCommand } from '../../impl';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { convertToPlan } from '../../../../converter.util';
import { Plan } from '../../../../types';

@CommandHandler(UpdatePlanCommand)
export class UpdatePlanHandler implements ICommandHandler<UpdatePlanCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdatePlanCommand): Promise<Plan> {
    this.logger.log(`Async ${this.constructor.name}...`);
    const { input, id } = command;

    try {
      if (input === null ) { // Check to make sure input is not null
        throw new UserInputError('Plan input name missing'); // Throw an apollo input error
      }

      if (id === null) { // Check to make sure input is not null
        throw new UserInputError('Plan to update id input missing'); // Throw an apollo input error
      }

      const product = await this.stripeClient.products.retrieve(id);
      if (!product) {
        throw new ConflictError('Plan with ID does not exist');
      }

      const metadata: Stripe.IOptionsMetadata = {};
      // tslint:disable-next-line:no-unused-expression
      input.features && input.features.forEach(value => {
        metadata[value.name] =  value.description;
      });

      const products = await this.stripeClient.products.update(id, {
        active: input.active,
        metadata,
        name: input.name,
        description: input.description,
      });

      if (input.prices && input.prices.length > 0) {
        const plansToRemove = await this.stripeClient.plans.list({
          product: id,
        });

        if (plansToRemove.data && plansToRemove.data.length > 0) {
          for (const p of plansToRemove.data) {
            await this.stripeClient.plans.del(p.id);
          }
        }

        for (const p of input.prices) {
          await this.stripeClient.plans.create({
            product: product.id,
            id: p.id && `plan-${p.id}`,
            currency: p.currency,
            nickname: p.nickname,
            amount: p.price,
            trial_period_days: p.intervalCount,
            interval: p.interval,
            usage_type: 'licensed',
          });
        }
      }

      const plans = await this.stripeClient.plans.list({
        product: product.id,
      });
      const plan = convertToPlan(plans, product);

      // @ts-ignore
      const eventData: PlanEntity = { ...plan };
      await this.eventBus.publish(new PlanUpdatedEvent(eventData));
      return plan;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }

}
