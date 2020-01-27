import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { PlanEntity } from '@graphqlcqrs/repository';
import { PlanCreatedEvent } from '@graphqlcqrs/core';
import slugify from '@sindresorhus/slugify';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { ConflictError } from '@graphqlcqrs/common';
import { CreatePlanCommand } from '../../impl';
import { Plan } from '../../../../types';
import { convertToPlan } from '../../../../converter.util';

@CommandHandler(CreatePlanCommand)
export class CreatePlanHandler implements ICommandHandler<CreatePlanCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreatePlanCommand): Promise<Plan> {
    this.logger.log(`Async ${this.constructor.name}...`);
    const { input } = command;

    try {
      if (input === null || input.name === null ) { // Check to make sure input is not null
        throw new UserInputError('Plan input name missing'); // Throw an apollo input error
      }

      if (input.features === null || input.features.length < 1 ) { // Check to make sure input is not null
        throw new UserInputError('Plan features input missing'); // Throw an apollo input error
      }

      if (input.name === null || input.features.length < 1 ) { // Check to make sure input is not null
        throw new UserInputError('Plan name input missing'); // Throw an apollo input error
      }

      const metadata: Stripe.IOptionsMetadata = {};
      const normalizedName = slugify(input.name);
      input.features.forEach(value => {
        metadata[value.name] =  value.description;
      });

      if (await this.stripeClient.products.retrieve(`product-${normalizedName}`)) {
        throw new ConflictError('Plan with ID already exist');
      }

      const product = await this.stripeClient.products.create({
        description: input.name,
        id: `product-${normalizedName}`,
        type: 'service',
        name: input.name,
        metadata,
      });

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

      const plans = await this.stripeClient.plans.list({
        product: product.id,
      });

      const plan = convertToPlan(plans, product);
      // @ts-ignore
      const eventData: PlanEntity = {
        ...plan,
      };

      await this.eventBus.publish(new PlanCreatedEvent(eventData));
      return plan;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }
}
