import { Args, Context, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Billing, BillingMutations, Invoice, TenantSubscription } from './types';
import { BillingsRpcClientService, GqlAuthGuard, Resource, setRpcContext } from '@ultimatebackend/core';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Billing)
export class BillingsResolver {
  constructor(private readonly service: BillingsRpcClientService) {}

  @Query(() => Billing, {nullable: true, name: 'billing'})
  async billingQuery() {
    return {};
  }

  @UseGuards(GqlAuthGuard)
  @Resource({ name: 'billing', identify: 'billing:subscription:change', roles: ['owner'], action: 'update' })
  @ResolveField(() => Invoice, {nullable: true})
  async invoice(@Args('id') id: string, @Context() ctx): Promise<Invoice> {
    const result = await this.service.billing.readInvoice({id}, setRpcContext(ctx)).toPromise();
    return result.invoice as Invoice;
  }

  @UseGuards(GqlAuthGuard)
  @Resource({ name: 'billing', identify: 'billing:invoice', roles: ['owner'], action: 'read' })
  @ResolveField(() => [Invoice], {nullable: true})
  async invoices(@Context() ctx): Promise<Invoice[]> {
    const result = await this.service.billing.findInvoices({}, setRpcContext(ctx)).toPromise();
    return result.invoices as Invoice[];
  }

  @Mutation(() => BillingMutations, {nullable: true})
  async billing() {
    return {};
  }

  @UseGuards(GqlAuthGuard)
  @Resource({ name: 'billing', identify: 'billing:subscription', roles: ['owner'], action: 'read' })
  @ResolveField(() => TenantSubscription, {nullable: true})
  async subscription( @Args('id') id: string, @Context() ctx): Promise<TenantSubscription> {
    const result = await this.service.billing.readSubscription({id}, setRpcContext(ctx)).toPromise();
    return result.subscription;
  }

  @UseGuards(GqlAuthGuard)
  @Resource({ name: 'billing', identify: 'billing:subscription', roles: ['owner'], action: 'read' })
  @ResolveField(() => [TenantSubscription], {nullable: true})
  async subscriptions(@Context() ctx): Promise<TenantSubscription[]> {
    const result = await this.service.billing.findSubscriptions({}, setRpcContext(ctx)).toPromise();
    return result.subscriptions;
  }
}
