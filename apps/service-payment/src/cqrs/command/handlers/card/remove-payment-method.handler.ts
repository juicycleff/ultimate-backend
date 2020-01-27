import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import {plainToClass} from 'class-transformer';
import { RemovePaymentMethodCommand } from '../../impl';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { Card } from '@ultimatebackend/contracts';
import { convertFromToCard } from '../../../../converter.util';
import { CardEntity } from '@graphqlcqrs/repository';
import { PaymentMethodDeletedEvent } from '@graphqlcqrs/core';
import { ConflictError } from '@graphqlcqrs/common';

@CommandHandler(RemovePaymentMethodCommand)
export class RemovePaymentMethodHandler implements ICommandHandler<RemovePaymentMethodCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemovePaymentMethodCommand): Promise<Card> {
    this.logger.log(`Async ${this.constructor.name}...`);
    const { input: { id }, user } = command;

    try {
      if (id === null) { // Check to make sure input is not null
        throw new UserInputError('Plan ID missing'); // Throw an apollo input error
      }

      const customerId = user.payment.stripeId;

      const card = await this.stripeClient.customers.retrieveCard(customerId, id);
      if (!card) {
        throw new ConflictError('Card with ID already exist');
      }

      await this.stripeClient.customers.deleteCard(customerId, id);
      const convCard = convertFromToCard(card) as Card;
      const pub = plainToClass(CardEntity, convCard);

      this.eventBus.publish(new PaymentMethodDeletedEvent(pub));
      return convCard;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }

}
