import { Logger, CACHE_MANAGER, Inject, CacheStore } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { GetSubscriptionQuery } from '../../impl';
import {
  ReadSubscriptionResponse,
  TenantSubscription,
} from '@ultimatebackend/proto-schema/billing';
import { RpcException } from '@nestjs/microservices';
import { subsToProtoStripeSubs } from '../../../../../common';

@QueryHandler(GetSubscriptionQuery)
export class GetSubscriptionHandler
  implements IQueryHandler<GetSubscriptionQuery> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(
    query: GetSubscriptionQuery,
  ): Promise<ReadSubscriptionResponse> {
    this.logger.log(`Async ${query.constructor.name}...`);

    try {
      const { input } = query;

      if (!input.id) {
        throw new RpcException('Missing subscription id input');
      }
      const cacheKey = 'service-payment/subscription/' + input.id;

      // Check cache to see if data exist
      const cacheData = await this.cacheStore.get<TenantSubscription>(cacheKey);
      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return {
          subscription: cacheData,
        };
      }

      const sub = await this.stripeClient.subscriptions.retrieve(input.id);
      const subscription = subsToProtoStripeSubs(sub);

      await this.cacheStore.set(cacheKey, subscription, { ttl: 50 });
      return {
        subscription,
      };
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
