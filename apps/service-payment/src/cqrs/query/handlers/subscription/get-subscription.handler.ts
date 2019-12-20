import { Logger, CACHE_MANAGER, Inject, CacheStore } from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { UserInputError } from 'apollo-server-express';
import { TenantSubscription } from '../../../../types';
import * as converter from '../../../../converter.util';
import { GetSubscriptionQuery } from '../../impl';

@QueryHandler(GetSubscriptionQuery)
export class GetSubscriptionHandler implements IQueryHandler<GetSubscriptionQuery> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: GetSubscriptionQuery): Promise<TenantSubscription> {
    this.logger.log(`Async ${query.constructor.name}...`);
    const { id } = query;

    if (!id) { throw new UserInputError('Missing subscription id input'); }

    const cacheKey = 'service-payment/subscription/' + id;

    // Check cache to see if data exist
    const cacheData = await this.cacheStore.get<TenantSubscription>(cacheKey);
    if (cacheData !== undefined && typeof cacheData !== 'undefined') {
      return cacheData;
    }

    const sub = await this.stripeClient.subscriptions.retrieve(id);
    const result = converter.convertFromToSubscription(sub) as TenantSubscription;

    await this.cacheStore.set(cacheKey, result, {ttl: 50});
    return result;
  }
}
