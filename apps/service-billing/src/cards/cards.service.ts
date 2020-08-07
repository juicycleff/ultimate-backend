import { Injectable, Logger } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import {
  CreateCardRequest,
  CreateCardResponse,
  DeleteCardRequest,
  DeleteCardResponse,
  FindCardsRequest,
  FindCardsResponse,
  ReadCardRequest,
  SetDefaultCardRequest,
  SetDefaultCardResponse,
} from '@ultimatebackend/proto-schema/billing';
import { RpcException } from '@nestjs/microservices';
import { cardSliceToProtoCardSlice, cardToProtoCard } from '../common';
import ICardSourceCreationOptions = Stripe.cards.ICardSourceCreationOptions;

@Injectable()
export class CardsService {
  logger = new Logger(this.constructor.name);
  public constructor(@InjectStripe() private readonly stripeClient: Stripe) {}

  async create(
    input: CreateCardRequest,
    customerId: string,
  ): Promise<CreateCardResponse> {
    try {
      if (input === null) {
        // Check to make sure input is not null
        throw new RpcException('Card input missing'); // Throw an apollo input error
      }

      if (!customerId) {
        throw new RpcException('Current user not correctly registered');
      }

      const customer = await this.stripeClient.customers.retrieve(customerId);
      if (!customer) {
        throw new RpcException('Invalid customer ID');
      }

      const cardSrc: ICardSourceCreationOptions = {
        address_city: input.address?.city,
        address_country: input.address?.country,
        address_state: input.address?.state,
        address_line2: input.address?.line2,
        address_line1: input.address.line,
        address_zip: input.address.postalCode,
        exp_month: parseInt(input.expMonth, 10),
        exp_year: parseInt(input.expYear, 10),
        cvc: input.cvc,
        number: input.number,
        name: input.name,
        object: 'card',
      };

      const cardToken = await this.stripeClient.tokens.create({
        card: cardSrc,
      });

      const cardSource = (await this.stripeClient.customers.createSource(
        customerId,
        {
          source: cardToken.id,
        },
      )) as Stripe.cards.ICard;

      return {
        card: cardToProtoCard(cardSource, customer?.default_source?.toString()),
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }

  async read(
    input: ReadCardRequest,
    customerId: string,
  ): Promise<CreateCardResponse> {
    try {
      if (input === null) {
        // Check to make sure input is not null
        throw new RpcException('Card input missing'); // Throw an apollo input error
      }

      if (!customerId) {
        throw new RpcException('Current user not correctly registered');
      }

      const customer = await this.stripeClient.customers.retrieve(customerId);
      if (!customer) {
        throw new RpcException('Invalid customer ID');
      }
      const card = await this.stripeClient.customers.retrieveSource(
        customerId,
        input.id,
      );

      return {
        // @ts-ignore
        card: cardToProtoCard(card, customer?.default_source?.toString()),
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }

  async setDefaultCard(
    input: SetDefaultCardRequest,
    customerId: string,
  ): Promise<SetDefaultCardResponse> {
    try {
      if (input === null) {
        // Check to make sure input is not null
        throw new RpcException('Card input missing'); // Throw an apollo input error
      }

      if (!customerId) {
        throw new RpcException('Current user not correctly registered');
      }

      if (!input.id) {
        throw new RpcException('Missing card identifier');
      }

      const card = await this.stripeClient.customers.retrieveSource(
        customerId,
        input.id,
      );
      if (!card) {
        throw new RpcException('Card not found');
      }

      const customer = await this.stripeClient.customers.retrieve(customerId);
      if (!customer) {
        throw new RpcException('Invalid customer');
      }

      const newCustomer = await this.stripeClient.customers.update(customerId, {
        default_source: input.id,
      });

      return {
        // @ts-ignore
        card: cardToProtoCard(card, newCustomer?.default_source?.toString()),
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }

  async delete(
    input: DeleteCardRequest,
    customerId: string,
  ): Promise<DeleteCardResponse> {
    try {
      if (input === null) {
        // Check to make sure input is not null
        throw new RpcException('Card input missing'); // Throw an apollo input error
      }

      if (!customerId) {
        throw new RpcException('Current user not correctly registered');
      }

      const [customer, card] = await Promise.all([
        this.stripeClient.customers.retrieve(customerId),
        this.stripeClient.customers.retrieveSource(customerId, input.id),
      ]);

      if (!customer) {
        throw new RpcException('Invalid customer ID');
      }

      await this.stripeClient.customers.deleteCard(customerId, input.id);

      return {
        // @ts-ignore
        card: cardToProtoCard(card, customer?.default_source?.toString()),
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }

  async list(
    input: FindCardsRequest,
    customerId: string,
  ): Promise<FindCardsResponse> {
    try {
      if (input === null) {
        // Check to make sure input is not null
        throw new RpcException('Card input missing'); // Throw an apollo input error
      }

      if (!customerId) {
        throw new RpcException('Current user not correctly registered');
      }

      const customer = await this.stripeClient.customers.retrieve(customerId);
      if (!customer) {
        throw new RpcException('Invalid customer ID');
      }
      const cardObjs = await this.stripeClient.customers.listSources(
        customerId,
        { object: 'card' },
      );
      const cardsList = (cardObjs.data as unknown) as Stripe.cards.ICard[];

      return {
        cards: cardSliceToProtoCardSlice(
          cardsList,
          customer?.default_source?.toString(),
        ),
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
