import { Logger, CACHE_MANAGER, Inject, CacheStore } from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { Plan } from '../../../../types';
import { convertToPlan } from '../../../../converter.util';
import { GetPlanQuery } from '../../impl';

@QueryHandler(GetPlanQuery)
export class GetPlanHandler implements IQueryHandler<GetPlanQuery> {
  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: GetPlanQuery): Promise<Plan> {
    Logger.log(query, 'GetPlanQuery'); // write here
    const { id } = query;

    if (!id) { throw Error('Missing plan id input'); }

    // Check cache to see if data exist
    const cacheData = await this.cacheStore.get<Plan>('service-payment/' + id);
    if (cacheData !== undefined && typeof cacheData !== 'undefined') {
      return cacheData;
    }

    const product = await this.stripeClient.products.retrieve(id);
    const plans = await this.stripeClient.plans.list({
      product: product.id,
    });
    const result = convertToPlan(plans, product);

    await this.cacheStore.set('service-payment/' + id, result, {ttl: 50});
    return result;
  }
}
