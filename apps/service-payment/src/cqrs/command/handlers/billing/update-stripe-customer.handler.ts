import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { Customer, StripeUserUpdatedEvent } from '@graphqlcqrs/core';
import { NotFoundError } from '@graphqlcqrs/common';
import { UpdateStripeCustomerCommand } from '../../impl';
import * as Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';

@CommandHandler(UpdateStripeCustomerCommand)
export class UpdateStripeCustomerHandler implements ICommandHandler<UpdateStripeCustomerCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateStripeCustomerCommand): Promise<Customer> {
    this.logger.log(`Async ${this.constructor.name}...`);
    const { data, id } = command;

    try {
      if (id === null || data === null ) { // Check to make sure input is not null
        throw new UserInputError('Customer id or data missing in your update request'); // Throw an apollo input error
      }

      const customerExist = await this.stripeClient.customers.retrieve(id);
      if (!customerExist) { // Check to make sure input is not null
        throw new NotFoundError('Customer is not found'); // Throw an apollo input error
      }
      const customer = await this.stripeClient.customers.update(id, data);

      // @ts-ignore
      const customerMod: Customer = {
        ...customer,
      };

      this.eventBus.publish(new StripeUserUpdatedEvent(customerMod));
      return customerMod;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }

}
