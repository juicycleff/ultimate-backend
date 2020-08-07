import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import {
  BillingMutations,
  ChangeSubscriptionInput,
  TenantSubscription,
} from './types';
import { UseGuards } from '@nestjs/common';
import {
  CurrentIdentity,
  GqlAuthGuard,
  Resource,
  setRpcContext,
} from '@ultimatebackend/core';

@Resolver(() => BillingMutations)
export class BillingsMutationResolver {
  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'billing',
    identify: 'billing:subscription:change',
    roles: ['owner'],
    action: 'update',
  })
  @ResolveField(() => TenantSubscription)
  async changeSubscription(
    @Args('input') input: ChangeSubscriptionInput,
    @CurrentIdentity() identity,
    @Context() ctx,
  ): Promise<TenantSubscription> {
    const { user, tenant } = identity;
    const result = await ctx?.rpc?.billing?.svc
      .changeSubscription(
        {
          couponId: input.couponId,
          planId: input.planId,
          customerId: user.settings.stripeId,
          tenantId: tenant.normalizedNAme,
        },
        setRpcContext(ctx),
      )
      .toPromise();

    return (result.subscription as unknown) as TenantSubscription;
  }

  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'billing',
    identify: 'billing:subscription:change',
    roles: ['owner'],
    action: 'delete',
  })
  @ResolveField(() => TenantSubscription)
  async cancelSubscription(
    @CurrentIdentity() identity,
    @Context() ctx,
  ): Promise<TenantSubscription> {
    const { user, tenant } = identity;
    const result = await ctx?.rpc?.billing?.svc
      .cancelSubscription(
        {
          customerId: user.settings.stripeId,
          tenantId: tenant.normalizedNAme,
        },
        setRpcContext(ctx),
      )
      .toPromise();

    return (result.subscription as unknown) as TenantSubscription;
  }
}
