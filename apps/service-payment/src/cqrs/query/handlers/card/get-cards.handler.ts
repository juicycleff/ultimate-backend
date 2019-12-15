import { CACHE_MANAGER, CacheStore, Inject, Logger } from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { Card } from '@ultimatebackend/contracts';
import { ApolloError } from 'apollo-server-express';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { GetCardsQuery } from '../../impl';
import { convertFromToCard } from '../../../../converter.util';

@QueryHandler(GetCardsQuery)
export class GetCardsHandler implements IQueryHandler<GetCardsQuery> {
  logger = new Logger(this.constructor.name);

  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: GetCardsQuery): Promise<Card[]> {
    this.logger.log(`Async ${this.constructor.name}...`);
    const { user } = query;

    try {
      const customerId = user.payment.stripeId;
      const cacheKey = `service-card/card-list-user${user.id}`;
      // Check cache to see if data exist
      const cacheData = await this.cacheStore.get<Card[]>(cacheKey);
      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return cacheData;
      }

      const cardObjs = await this.stripeClient.customers.listSources(customerId, {
        object: 'card',
      });
      const cardsList = cardObjs.data as unknown as Stripe.cards.ICard[];
      const card = convertFromToCard(cardsList) as unknown as Card[];

      await this.cacheStore.set(cacheKey, card, {ttl: 50});
      return card;
    } catch (e) {
      this.logger.error(e);
      throw new ApolloError(e);
    }
  }
}
