import { CACHE_MANAGER, CacheStore, Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import * as Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';
import { GetSubscriptionsQuery } from '../../impl';
import {
  FindSubscriptionsResponse,
  TenantSubscription,
} from '@ultimatebackend/proto-schema/billing';
import { RpcException } from '@nestjs/microservices';
import { subsSliceToProtoStripePlanSubs } from '../../../../../common';

@QueryHandler(GetSubscriptionsQuery)
export class GetSubscriptionsHandler
  implements IQueryHandler<GetSubscriptionsQuery> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(
    query: GetSubscriptionsQuery,
  ): Promise<FindSubscriptionsResponse> {
    this.logger.log(`Async ${query.constructor.name}...`);
    const { identity } = query;

    try {
      if (identity.customerId === null) {
        // Check to make sure input is not null
        throw new RpcException('Current customer id missing'); // Throw an input error
      }

      if (identity.tenantId === null) {
        // Check to make sure input is not null
        throw new RpcException('Current tenant id missing'); // Throw an input error
      }

      const { tenantId, customerId } = identity;
      const cacheKey = 'service-billing/subscriptions/' + customerId + tenantId;

      // Check cache to see if data exist
      const cacheData = await this.cacheStore.get<TenantSubscription[]>(
        cacheKey,
      );
      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return {
          subscriptions: cacheData,
        };
      }

      const result = await this.stripeClient.subscriptions.list({
        customer: customerId,
      });

      console.log(result.data[0]);

      if (result.data && result.data.length <= 0) {
        return { subscriptions: [] };
      }

      const subscriptions = result.data.filter(
        (r) => r.metadata?.tenantId === tenantId,
      );

      const tenantSubscriptions = subsSliceToProtoStripePlanSubs(subscriptions);

      console.log('tenantSubscriptions', tenantSubscriptions);
      await this.cacheStore.set(cacheKey, tenantSubscriptions, { ttl: 200 });
      return {
        subscriptions: tenantSubscriptions,
      };
    } catch (e) {
      this.logger.error(e);
      throw new RpcException(e);
    }
  }
}
