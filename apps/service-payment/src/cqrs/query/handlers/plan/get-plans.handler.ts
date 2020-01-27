import { CACHE_MANAGER, CacheStore, Inject, Logger } from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {ApolloError} from 'apollo-server-express';
import * as Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';
import { GetPlansQuery } from '../../impl';
import { Plan } from '../../../../types';
import { convertToPlan } from '../../../../converter.util';

@QueryHandler(GetPlansQuery)
export class GetPlansHandler implements IQueryHandler<GetPlansQuery> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: GetPlansQuery): Promise<Plan[]> {
    this.logger.log(`Async ${query.constructor.name}...`);
    const { where } = query;

    try {

      if (!where) { throw new ApolloError('Missing get where input'); }

      // Check cache to see if data exist
      const cacheData = await this.cacheStore.get<Plan[]>('service-payment/plans/' + JSON.stringify(where));
      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return cacheData;
      }

      const products = await this.stripeClient.products.list({
        ...where,
      });

      if (products.total_count <= 0) {  return []; }

      const plans: Plan[] = [];
      for (const product of products.data) {
        const stripePlans = await this.stripeClient.plans.list({
          product: product.id,
        });
        plans.push(convertToPlan(stripePlans, product));
      }

      await this.cacheStore.set('service-payment/plans/' + JSON.stringify(where), plans, {ttl: 200});
      return plans;
    } catch (e) {
      this.logger.error(e);
      throw new ApolloError(e);
    }
  }
}
