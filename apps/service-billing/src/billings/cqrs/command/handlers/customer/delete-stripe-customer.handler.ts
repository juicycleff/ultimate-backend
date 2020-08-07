import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Customer, StripeUserDeletedEvent } from '@ultimatebackend/core';
import { DeleteStripeCustomerCommand } from '../../impl';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(DeleteStripeCustomerCommand)
export class DeleteStripeCustomerHandler
  implements ICommandHandler<DeleteStripeCustomerCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteStripeCustomerCommand): Promise<Customer> {
    this.logger.log(`Async ${this.constructor.name}...`);
    const { id } = command;

    try {
      if (id === null) {
        // Check to make sure input is not null
        throw new RpcException('Customer id is missing'); // Throw an input error
      }

      const customer = await this.stripeClient.customers.retrieve(id);
      if (!customer) {
        // Check to make sure input is not null
        throw new RpcException('Customer is not found'); // Throw an input error
      }

      await this.stripeClient.customers.del(id);

      // @ts-ignore
      const customerMod: Customer = {
        ...customer,
      };

      await this.eventBus.publish(new StripeUserDeletedEvent(customerMod));
      return customerMod;
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }
}
