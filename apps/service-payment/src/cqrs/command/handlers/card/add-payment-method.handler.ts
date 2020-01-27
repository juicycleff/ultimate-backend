import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { plainToClass } from 'class-transformer';
import { AddPaymentMethodCommand } from '../../impl';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { Card } from '@ultimatebackend/contracts';
import { convertFromToCard } from '../../../../converter.util';
import { CardEntity } from '@graphqlcqrs/repository';
import { PaymentMethodAddedEvent } from '@graphqlcqrs/core';
import { BadRequestError } from '@graphqlcqrs/common';

@CommandHandler(AddPaymentMethodCommand)
export class AddPaymentMethodHandler implements ICommandHandler<AddPaymentMethodCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddPaymentMethodCommand): Promise<Card> {
    this.logger.log(`Async ${this.constructor.name}...`);
    const { input, user } = command;

    try {
      if (input === null) { // Check to make sure input is not null
        throw new UserInputError('Card input missing'); // Throw an apollo input error
      }

      if (user.payment === null ||
        user.payment.stripeId === undefined ||
        user.payment.stripeId === null) {
        throw new BadRequestError('Current user not correcly signedup');
      }
      const customerId = user.payment.stripeId;

      const customer = await this.stripeClient.customers.retrieve(customerId);
      const cardToken = await this.stripeClient.tokens.create({
        card: {
          address_city: input.address?.city,
          address_country: input.address?.country,
          address_state: input.address?.state,
          address_line2: input.address?.line2,
          address_line1: input.address.line,
          address_zip: input.address.postalCode,
          exp_month: input.expMonth,
          exp_year: input.expYear,
          cvc: input.cvc,
          number: input.number,
          name: input.name,
          object: 'card',
        },
      });

      const cardSource = await this.stripeClient.customers.createSource(
        customerId,
        {
          source: cardToken.id,
        },
      ) as Stripe.cards.ICard;

      const card = convertFromToCard(cardSource) as Card;
      const pub = plainToClass(CardEntity, card);

      this.eventBus.publish(new PaymentMethodAddedEvent(pub));
      return card;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }

}
