import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  Billing,
  BillingMutations,
  Invoice,
  TenantSubscription,
} from './types';
import { GqlAuthGuard, Resource, setRpcContext } from '@ultimatebackend/core';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Billing)
export class BillingsResolver {
  @Query(() => Billing, { nullable: true, name: 'billing' })
  async billingQuery() {
    return {};
  }

  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'billing',
    identify: 'billing:subscription:change',
    roles: ['owner'],
    action: 'update',
  })
  @ResolveField(() => Invoice, { nullable: true })
  async invoice(@Args('id') id: string, @Context() ctx): Promise<Invoice> {
    const result = await ctx?.rpc?.billing?.svc
      .readInvoice({ id }, setRpcContext(ctx))
      .toPromise();
    return (result.invoice as unknown) as Invoice;
  }

  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'billing',
    identify: 'billing:invoice',
    roles: ['owner'],
    action: 'read',
  })
  @ResolveField(() => [Invoice], { nullable: true })
  async invoices(@Context() ctx): Promise<Invoice[]> {
    const result = await ctx?.rpc?.billing?.svc
      .findInvoices({}, setRpcContext(ctx))
      .toPromise();
    return (result.invoices as unknown) as Invoice[];
  }

  @Mutation(() => BillingMutations, { nullable: true })
  async billing() {
    return {};
  }

  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'billing',
    identify: 'billing:subscription',
    roles: ['owner'],
    action: 'read',
  })
  @ResolveField(() => TenantSubscription, { nullable: true })
  async subscription(
    @Args('id') id: string,
    @Args('tenantId') tenantId: string,
    @Context() ctx,
  ): Promise<TenantSubscription> {
    const result = await ctx?.rpc?.billing?.svc
      .readSubscription({ id, tenantId }, setRpcContext(ctx))
      .toPromise();
    return (result.subscription as unknown) as TenantSubscription;
  }

  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'billing',
    identify: 'billing:subscription',
    roles: ['owner'],
    action: 'read',
  })
  @ResolveField(() => [TenantSubscription], { nullable: true })
  async subscriptions(
    @Args('tenantId') tenantId: string,
    @Context() ctx,
  ): Promise<TenantSubscription[]> {
    const result = await ctx?.rpc?.billing?.svc
      .findSubscriptions(
        {
          tenantId,
        },
        setRpcContext(ctx),
      )
      .toPromise();
    return (result.subscriptions as unknown) as TenantSubscription[];
  }
}
