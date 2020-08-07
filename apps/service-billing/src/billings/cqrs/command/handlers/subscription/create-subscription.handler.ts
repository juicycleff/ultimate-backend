import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { cards } from 'stripe';
import { SubscriptionCreatedEvent } from '@ultimatebackend/core';
import { CreateSubscriptionCommand } from '../../impl';
import { CreateSubscriptionResponse } from '@ultimatebackend/proto-schema/billing';
import { RpcException } from '@nestjs/microservices';
import { subsToProtoStripeSubs } from '../../../../../common';
import { NotFoundRpcException } from '@ultimatebackend/common';

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionHandler
  implements ICommandHandler<CreateSubscriptionCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: CreateSubscriptionCommand,
  ): Promise<CreateSubscriptionResponse> {
    this.logger.log(`Async ${this.constructor.name}...`);
    const { input } = command;

    try {
      if (input.customerId === null) {
        // Check to make sure input is not null
        throw new RpcException('Current customer id missing'); // Throw an input error
      }

      if (input.tenantId === null) {
        // Check to make sure input is not null
        throw new RpcException('Current tenant id missing'); // Throw an input error
      }

      if (input.planId === null) {
        // Check to make sure input is not null
        throw new RpcException('Current plan id missing'); // Throw an input error
      }

      const [customer, plan] = await Promise.all([
        this.stripeClient.customers.retrieve(input.customerId),
        this.stripeClient.plans.retrieve(input.planId),
      ]);

      const defaultCard = customer.default_source as cards.ICard;
      if (plan === null || defaultCard === null) {
        // Check to make sure input is not null
        throw new NotFoundRpcException('Please add a payment card'); // Throw an input error
      }

      /**
       * If a specific card was passed, lets get and use it as default payment
       * card for this subscription, else use the default card
       */
      if (input.cardId) {
        const card = await this.stripeClient.customers.retrieveCard(
          input.customerId,
          input.cardId,
        );
        if (card) {
          await this.stripeClient.customers.update(input.customerId, {
            default_source: card.id,
          });
        }
      }

      const sub = await this.stripeClient.subscriptions.create({
        customer: input.customerId,
        items: [{ plan: plan.id }],
        trial_from_plan: true,
        coupon: input?.couponId,
        metadata: {
          tenantId: input.tenantId,
        },
      });

      await this.eventBus.publish(new SubscriptionCreatedEvent(sub));
      return {
        subscription: subsToProtoStripeSubs(sub),
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }
}
