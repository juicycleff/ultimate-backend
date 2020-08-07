import { CACHE_MANAGER, CacheStore, Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import * as Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';
import { GetInvoicesQuery } from '../../impl';
import { BadRequestError } from '@ultimatebackend/common';
import {
  FindInvoicesResponse,
  Invoice,
} from '@ultimatebackend/proto-schema/billing';
import { invoiceSliceToProtoInvoiceSlice } from '../../../../../common';
import { RpcException } from '@nestjs/microservices';

@QueryHandler(GetInvoicesQuery)
export class GetInvoicesHandler implements IQueryHandler<GetInvoicesQuery> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: GetInvoicesQuery): Promise<FindInvoicesResponse> {
    this.logger.log(`Async ${query.constructor.name}...`);
    const { customerId } = query;
    try {
      if (customerId === null) {
        // Check to make sure input is not null
        throw new RpcException('Current user missing'); // Throw an input error
      }

      const cacheKey = 'service-billing/invoices/' + customerId;

      // Check cache to see if data exist
      const cacheData = await this.cacheStore.get<Invoice[]>(cacheKey);
      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return {
          invoices: cacheData,
        };
      }

      const invoices = await this.stripeClient.invoices.list({
        customer: customerId,
      });

      if (invoices.data && invoices.data.length > 0) {
        const lists = invoiceSliceToProtoInvoiceSlice(invoices.data);
        await this.cacheStore.set(cacheKey, lists, { ttl: 200 });
        return {
          invoices: lists,
        };
      } else {
        return { invoices: [] };
      }
    } catch (e) {
      this.logger.error(e);
      throw new RpcException(e);
    }
  }
}
