import { CACHE_MANAGER, CacheStore, Inject, Logger } from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {ApolloError} from 'apollo-server-express';
import * as Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';
import { BadRequestError } from '@graphqlcqrs/common';
import { GetSubscriptionsQuery } from '../../impl';
import { TenantSubscription } from '../../../../types';
import * as converters from '../../../../converter.util';

@QueryHandler(GetSubscriptionsQuery)
export class GetSubscriptionsHandler implements IQueryHandler<GetSubscriptionsQuery> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: GetSubscriptionsQuery): Promise<TenantSubscription[]> {
    this.logger.log(`Async ${query.constructor.name}...`);
    const { identity } = query;

    try {

      if (identity.userId === null || identity.customerId === null ) { // Check to make sure input is not null
        throw new BadRequestError('Current user missing'); // Throw an apollo input error
      }

      if (identity.tenantId === null) { // Check to make sure input is not null
        throw new BadRequestError('Current tenant missing'); // Throw an apollo input error
      }

      const { tenantId, userId, customerId } = identity;
      const cacheKey = 'service-payment/subscriptions/' + userId + tenantId;

      // Check cache to see if data exist
      const cacheData = await this.cacheStore.get<TenantSubscription[]>(cacheKey);
      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return cacheData;
      }

      const result = await this.stripeClient.subscriptions.list({
        customer: customerId,
      });

      if (result.data && result.data.length <= 0) {  return []; }

      const subscriptions = result.data.filter(r => r.metadata?.tenantId === tenantId);
      const tenantSubscriptions = converters.convertFromToSubscription(subscriptions) as TenantSubscription[];

      await this.cacheStore.set(cacheKey, tenantSubscriptions, {ttl: 200});
      return tenantSubscriptions;
    } catch (e) {
      this.logger.error(e);
      throw new ApolloError(e);
    }
  }
}
