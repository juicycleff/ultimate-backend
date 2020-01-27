import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import {plainToClass} from 'class-transformer';
import { UpdatePaymentMethodCommand } from '../../impl';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { Card } from '@ultimatebackend/contracts';
import { convertFromToCard } from '../../../../converter.util';
import { CardEntity } from '@graphqlcqrs/repository';
import { PaymentMethodUpdatedEvent } from '@graphqlcqrs/core';
import { BadRequestError, ConflictError } from '@graphqlcqrs/common';

@CommandHandler(UpdatePaymentMethodCommand)
export class UpdatePaymentMethodHandler implements ICommandHandler<UpdatePaymentMethodCommand> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdatePaymentMethodCommand): Promise<Card> {
    this.logger.log(`Async ${this.constructor.name}...`);
    const { input: {id, data }, user } = command;

    try {
      if (id === null || data === null) { // Check to make sure input is not null
        throw new UserInputError('Plan input missing'); // Throw an apollo input error
      }

      if (user.payment === null ||
        user.payment.stripeId === undefined ||
        user.payment.stripeId === null) {
        throw new BadRequestError('Current user not correcly signedup');
      }

      const customerId = user.payment.stripeId;
      if (!await this.stripeClient.customers.retrieveCard(customerId, id)) {
        throw new ConflictError('Card with ID already exist');
      }

      // Check if tenant exist with normalized name
      const card = await this.stripeClient.customers.updateCard(customerId, id, {
        address_city: data?.address?.city,
        address_line1: data?.address?.line,
        address_line2: data?.address?.line2,
        address_country: data?.address?.country,
        address_state: data?.address?.state,
        address_zip: data?.address?.postalCode,
        name: data?.name,
        exp_month: data?.expMonth,
        exp_year: data?.expYear,
      });

      const convCard = convertFromToCard(card) as Card;
      const pub = plainToClass(CardEntity, convCard);

      this.eventBus.publish(new PaymentMethodUpdatedEvent(pub));
      return convCard;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }

}
