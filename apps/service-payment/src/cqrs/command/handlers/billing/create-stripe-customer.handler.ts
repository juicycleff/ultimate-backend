import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { Customer, StripeUserCreatedEvent } from '@graphqlcqrs/core';
import { CreateStripeCustomerCommand } from '../../impl';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';

@CommandHandler(CreateStripeCustomerCommand)
export class CreateStripeCustomerHandler implements ICommandHandler<CreateStripeCustomerCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateStripeCustomerCommand): Promise<Customer> {
    this.logger.log(`Async ${command.constructor.name}...`);
    const { user } = command;

    try {
      if (user === null) { // Check to make sure input is not null
        throw new UserInputError('Current user input missing'); // Throw an apollo input error
      }

      // Check if tenant exist with normalized name
      const customer = await this.stripeClient.customers.create({
        email: user.emails.reduce(value => value.primary && value).address,
        name: user.firstname + ' ' + user.lastname,
      });

      // @ts-ignore
      const customerMod: Customer = {
        ...customer,
        userId: typeof user.id === 'string' ? user.id : user.id.toHexString(),
      };

      await this.eventBus.publish(new StripeUserCreatedEvent(customerMod));
      return customerMod;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }

}
