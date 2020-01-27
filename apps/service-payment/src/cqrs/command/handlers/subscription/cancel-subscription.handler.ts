import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError } from 'apollo-server-express';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { BadRequestError, NotFoundError } from '@graphqlcqrs/common';
import { SubscriptionCreatedEvent } from '@graphqlcqrs/core';
import { CancelSubscriptionCommand } from '../../impl';
import { TenantSubscription } from '../../../../types';
import * as converters from '../../../../converter.util';

@CommandHandler(CancelSubscriptionCommand)
export class CancelSubscriptionHandler implements ICommandHandler<CancelSubscriptionCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CancelSubscriptionCommand): Promise<TenantSubscription> {
    this.logger.log(`Async ${this.constructor.name}...`);
    const { identity } = command;

    try {
      if (identity.userId === null || identity.customerId === null ) { // Check to make sure input is not null
        throw new BadRequestError('Current user missing'); // Throw an apollo input error
      }

      if (identity.tenantId === null) { // Check to make sure input is not null
        throw new BadRequestError('Current tenant missing'); // Throw an apollo input error
      }

      const customer = await this.stripeClient.customers.retrieve(identity.customerId);
      if (customer === null) { // Check to make sure input is not null
        throw new BadRequestError('Current user payment method not setup'); // Throw an apollo input error
      }

      const subscriptions = await this.stripeClient.subscriptions.list({customer: customer.id});

      if (subscriptions.data && subscriptions.data.length > 0) {
        const currentSub = subscriptions.data.reduce(s => s.metadata.tenantId === identity.tenantId && s);

        if (currentSub) {
          const sub = await this.stripeClient.subscriptions.del(currentSub.id);
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
