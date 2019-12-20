import { CACHE_MANAGER, CacheStore, Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Card } from '@ultimatebackend/contracts';
import { GetCardQuery } from '../../impl';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { convertFromToCard } from '../../../../converter.util';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { BadRequestError } from '@graphqlcqrs/common';

@QueryHandler(GetCardQuery)
export class GetCardHandler implements IQueryHandler<GetCardQuery> {
  logger = new Logger(this.constructor.name);

  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: GetCardQuery): Promise<Card> {
    this.logger.log(`Async ${query.constructor.name}...`);
    const { id, user } = query;

    if (!id) { throw new UserInputError('Missing card id inputs'); }

    try {

      if (user.payment === null ||
        user.payment.stripeId === undefined ||
        user.payment.stripeId === null) {
        throw new BadRequestError('Current user not correcly signedup');
      }

      const customerId = user.payment.stripeId;
      const cacheKey = `service-card/${id}-user${user.id}`;
      // Check cache to see if data exist
      const cacheData = await this.cacheStore.get<Card>(cacheKey);
      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return cacheData;
      }

      const cardObj = await this.stripeClient.customers.retrieveCard(customerId, id);
      const card = convertFromToCard(cardObj) as Card;
      await this.cacheStore.set(cacheKey, card, {ttl: 50});
      return card;
    } catch (e) {
      this.logger.error(e);
      throw new ApolloError(e);
    }
  }
}
