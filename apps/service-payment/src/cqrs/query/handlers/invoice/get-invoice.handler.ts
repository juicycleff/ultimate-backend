import { Logger, CACHE_MANAGER, Inject, CacheStore } from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import * as converter from '../../../../converter.util';
import { GetInvoiceQuery } from '../../impl';
import { Invoice } from '../../../../types';
import { ApolloError, UserInputError } from 'apollo-server-express';

@QueryHandler(GetInvoiceQuery)
export class GetInvoiceHandler implements IQueryHandler<GetInvoiceQuery> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: GetInvoiceQuery): Promise<Invoice> {
    this.logger.log(`Async ${query.constructor.name}...`);
    const { id } = query;

    if (!id) { throw new UserInputError('Missing Invoice id input'); }

    try {
      // Check cache to see if data exist
      const cacheData = await this.cacheStore.get<Invoice>('service-payment/invoice/' + id);
      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return cacheData;
      }

      const invoice = await this.stripeClient.invoices.retrieve(id);
      const result = converter.convertFromToInvoice(invoice) as Invoice;

      await this.cacheStore.set('service-payment/invoice/' + id, result, {ttl: 100});
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new ApolloError(e);
    }
  }
}
