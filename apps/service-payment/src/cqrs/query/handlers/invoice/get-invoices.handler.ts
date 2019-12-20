import { CACHE_MANAGER, CacheStore, Inject, Logger } from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {ApolloError} from 'apollo-server-express';
import * as Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';
import { GetInvoicesQuery } from '../../impl';
import { Invoice } from '../../../../types';
import * as converter from '../../../../converter.util';
import { BadRequestError } from '@graphqlcqrs/common';

@QueryHandler(GetInvoicesQuery)
export class GetInvoicesHandler implements IQueryHandler<GetInvoicesQuery> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: GetInvoicesQuery): Promise<Invoice[]> {
    this.logger.log(`Async ${query.constructor.name}...`);
    const { identity } = query;

    try {

      if (identity.userId === null || identity.customerId === null ) { // Check to make sure input is not null
        throw new BadRequestError('Current user missing'); // Throw an apollo input error
      }

      if (identity.tenantId === null) { // Check to make sure input is not null
        throw new BadRequestError('Current tenant missing'); // Throw an apollo input error
      }

      const cacheKey = 'service-payment/invoices/' + identity.userId + identity.tenantId;

      // Check cache to see if data exist
      const cacheData = await this.cacheStore.get<Invoice[]>(cacheKey);
      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return cacheData;
      }

      const invoices = await this.stripeClient.invoices.list({
        customer: identity.customerId,
      });

      if (invoices.data && invoices.data.length > 0) {
        const lists = converter.convertFromToInvoice(invoices.data) as Invoice[];
        await this.cacheStore.set(cacheKey, lists, {ttl: 200});
        return lists;
      } else {
        return [];
      }
    } catch (e) {
      this.logger.error(e);
      throw new ApolloError(e);
    }
  }
}
