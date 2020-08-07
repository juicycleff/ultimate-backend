import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { SubscriptionCreatedEvent } from '@ultimatebackend/core';
import { CancelSubscriptionCommand } from '../../impl';
import { CancelSubscriptionResponse } from '@ultimatebackend/proto-schema/billing';
import { RpcException } from '@nestjs/microservices';
import { subsToProtoStripeSubs } from '../../../../../common';

@CommandHandler(CancelSubscriptionCommand)
export class CancelSubscriptionHandler
  implements ICommandHandler<CancelSubscriptionCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: CancelSubscriptionCommand,
  ): Promise<CancelSubscriptionResponse> {
    this.logger.log(`Async ${this.constructor.name}...`);
    const { input } = command;

    try {
      if (input.customerId === null) {
        // Check to make sure input is not null
        throw new RpcException('Current user missing'); // Throw an input error
      }

      if (input.tenantId === null) {
        // Check to make sure input is not null
        throw new RpcException('Current tenant missing'); // Throw an input error
      }

      const [customer, subscriptions] = await Promise.all([
        this.stripeClient.customers.retrieve(input.customerId),
        this.stripeClient.subscriptions.list({ customer: input.customerId }),
      ]);

      if (customer === null || subscriptions === null) {
        // Check to make sure input is not null
        throw new RpcException('No subscription found for this customer'); // Throw an input error
      }

      if (subscriptions.data && subscriptions.data.length > 0) {
        const currentSub = subscriptions.data.reduce(
          (s) => s.metadata.tenantId === input.tenantId && s,
        );

        if (currentSub) {
          const sub = await this.stripeClient.subscriptions.del(currentSub.id);
          await this.eventBus.publish(new SubscriptionCreatedEvent(sub));
          return {
            subscription: subsToProtoStripeSubs(sub),
          };
        }

        throw new RpcException('No subscription for this tenant');
      } else {
        throw new RpcException('No subscription for this tenant');
      }
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }
}
