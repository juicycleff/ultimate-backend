import { Resolver, Query, Args } from '@nestjs/graphql';
import { CurrentTenant, CurrentUser } from '@graphqlcqrs/common';
import { TenantEntity, UserEntity } from '@graphqlcqrs/repository';
import { QueryBus } from '@nestjs/cqrs';
import { UseGuards } from '@nestjs/common';
import { TenantGuard } from '@graphqlcqrs/core';
import { Invoice } from '../types';
import { GetInvoicesQuery, GetInvoiceQuery } from '../cqrs';

@Resolver(() => Invoice)
export class InvoiceResolver {
  constructor(
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(TenantGuard)
  @Query(() => Invoice)
  async invoice(
    @Args('id') id: string,
  ): Promise<Invoice> {
    return await this.queryBus.execute(new GetInvoiceQuery(id));
  }

  @UseGuards(TenantGuard)
  @Query(() => [Invoice])
  async invoices(
    @CurrentUser() user: UserEntity,
    @CurrentTenant() tenant: TenantEntity,
  ): Promise<Invoice[]> {
    return await this.queryBus.execute(new GetInvoicesQuery({
      customerId: user?.payment?.stripeId,
      userId: typeof user.id === 'string' ? user.id : user.id.toHexString(),
      tenantId: typeof tenant.id === 'string' ? tenant.id : tenant.id.toHexString(),
    }));
  }
}
