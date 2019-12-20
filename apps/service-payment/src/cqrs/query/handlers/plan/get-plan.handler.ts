import { Logger, CACHE_MANAGER, Inject, CacheStore } from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { UserInputError, ApolloError } from 'apollo-server-express';
import { Plan } from '../../../../types';
import { convertToPlan } from '../../../../converter.util';
import { GetPlanQuery } from '../../impl';

@QueryHandler(GetPlanQuery)
export class GetPlanHandler implements IQueryHandler<GetPlanQuery> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: GetPlanQuery): Promise<Plan> {
    this.logger.log(`Async ${query.constructor.name}...`);
    const { id } = query;

    if (!id) { throw new UserInputError('Missing plan id input'); }

    try {
      // Check cache to see if data exist
      const cacheData = await this.cacheStore.get<Plan>('service-payment/plan/' + id);
      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return cacheData;
      }

      const product = await this.stripeClient.products.retrieve(id);
      const plans = await this.stripeClient.plans.list({
        product: product.id,
      });
      const result = convertToPlan(plans, product);

      await this.cacheStore.set('service-payment/plan/' + id, result, {ttl: 50});
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new ApolloError(e);
    }
  }
}
