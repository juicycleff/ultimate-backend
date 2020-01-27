import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError } from 'apollo-server-express';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { BadRequestError } from '@graphqlcqrs/common';
import { cards } from 'stripe';
import { SubscriptionCreatedEvent } from '@graphqlcqrs/core';
import { CreateSubscriptionCommand } from '../../impl';
import { TenantSubscription } from '../../../../types';
import * as converters from '../../../../converter.util';

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionHandler implements ICommandHandler<CreateSubscriptionCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateSubscriptionCommand): Promise<TenantSubscription> {
    this.logger.log(`Async ${this.constructor.name}...`);
    const { input, identity } = command;

    try {
      if (identity.userId === null || identity.customerId === null ) { // Check to make sure input is not null
        throw new BadRequestError('Current user missing'); // Throw an apollo input error
      }

      if (identity.tenantId === null) { // Check to make sure input is not null
        throw new BadRequestError('Current tenant missing'); // Throw an apollo input error
      }

      const customer = await this.stripeClient.customers.retrieve(identity.customerId);
      const defaultCard = customer.default_source as cards.ICard;
      const plan = defaultCard && input.planId ?
        await this.stripeClient.plans.retrieve(input.planId) : { id: 'plan-free-basic'};

      const sub = await this.stripeClient.subscriptions.create({
        customer: identity.customerId,
        items: [
          { plan: plan.id },
        ],
        trial_from_plan: true,
        coupon: input?.couponId,
        metadata: {
          tenantId: identity.tenantId,
        },
      });

      const subscription = converters.convertFromToSubscription(sub) as TenantSubscription;

      await this.eventBus.publish(new SubscriptionCreatedEvent(sub));
      return subscription;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }
}
