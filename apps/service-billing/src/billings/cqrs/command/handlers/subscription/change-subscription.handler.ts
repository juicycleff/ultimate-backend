import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { SubscriptionCreatedEvent } from '@ultimatebackend/core';
import { ChangeSubscriptionCommand } from '../../impl';
import { ChangeSubscriptionResponse } from '@ultimatebackend/proto-schema/billing';
import { RpcException } from '@nestjs/microservices';
import { subsToProtoStripeSubs } from '../../../../../common';

@CommandHandler(ChangeSubscriptionCommand)
export class ChangeSubscriptionHandler
  implements ICommandHandler<ChangeSubscriptionCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: ChangeSubscriptionCommand,
  ): Promise<ChangeSubscriptionResponse> {
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

      const [customer, subscriptions] = await Promise.all([
        this.stripeClient.customers.retrieve(input.customerId),
        this.stripeClient.subscriptions.list({
          customer: input.customerId,
          status: 'active',
        }),
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
          if (
            currentSub.items.data &&
            currentSub.items.data.findIndex(
              (cur) => (cur.plan.id = input.planId),
            ) !== -1
          ) {
            throw new RpcException('This tenant is currently on this plan');
          }

          const plan = await this.stripeClient.plans.retrieve(input.planId);
          const sub = await this.stripeClient.subscriptions.update(
            currentSub.id,
            {
              items: [
                {
                  plan: plan.id,
                },
              ],
            },
          );
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
