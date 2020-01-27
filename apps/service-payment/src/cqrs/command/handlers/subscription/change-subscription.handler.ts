import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError } from 'apollo-server-express';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { BadRequestError, ConflictError, NotFoundError } from '@graphqlcqrs/common';
import { SubscriptionCreatedEvent } from '@graphqlcqrs/core';
import { ChangeSubscriptionCommand } from '../../impl';
import { TenantSubscription } from '../../../../types';
import * as converters from '../../../../converter.util';

@CommandHandler(ChangeSubscriptionCommand)
export class ChangeSubscriptionHandler implements ICommandHandler<ChangeSubscriptionCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ChangeSubscriptionCommand): Promise<TenantSubscription> {
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
      if (customer === null) { // Check to make sure input is not null
        throw new BadRequestError('Current current user payment method not setup'); // Throw an apollo input error
      }

      const subscriptions = await this.stripeClient.subscriptions.list({customer: customer.id});

      if (subscriptions.data && subscriptions.data.length > 0) {
        const currentSub = subscriptions.data.reduce(s => s.metadata.tenantId === identity.tenantId && s);

        if (currentSub) {
          if (currentSub.items.data && currentSub.items.data.findIndex(cur => cur.plan.id = input.planId) !== -1) {
            throw new ConflictError('This tenant is currently on this plan');
          }

          const plan = await this.stripeClient.plans.retrieve(input.planId);
          const sub = await this.stripeClient.subscriptions.update(currentSub.id, {
            items: [{
              plan: plan.id,
            }],
          });
          await this.eventBus.publish(new SubscriptionCreatedEvent(sub));
          return converters.convertFromToSubscription(sub) as TenantSubscription;
        }

        throw new NotFoundError('No subscription for this tenant');
      } else {
        throw new NotFoundError('No subscription for this tenant');
      }
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }
}
