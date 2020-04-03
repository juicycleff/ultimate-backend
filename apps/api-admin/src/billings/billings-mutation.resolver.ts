import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import { BillingMutations, ChangeSubscriptionInput, TenantSubscription } from './types';
import { UseGuards } from '@nestjs/common';
import { BillingsRpcClientService, CurrentIdentity, GqlAuthGuard, Resource, setRpcContext } from '@ultimatebackend/core';

@Resolver(() => BillingMutations)
export class BillingsMutationResolver {
  constructor(private readonly service: BillingsRpcClientService) {}

  @Resource({ name: 'billing', identify: 'billing:subscription:change', roles: ['owner'], action: 'update' })
  @ResolveField(() => TenantSubscription)
  async changeSubscription(@Args('input') input: ChangeSubscriptionInput, @CurrentIdentity() identity, @Context() ctx): Promise<TenantSubscription> {
    const {user, tenant} = identity;
    const result = await this.service.billing.changeSubscription({
      couponId: input.couponId,
      planId: input.planId,
      customerId: user.settings.stripeId,
      tenantId: tenant.normalizedNAme,
    }, setRpcContext(ctx)).toPromise();

    return result.subscription;
  }

  @Resource({ name: 'billing', identify: 'billing:subscription:change', roles: ['owner'], action: 'delete' })
  @ResolveField(() => TenantSubscription)
  async cancelSubscription(@CurrentIdentity() identity, @Context() ctx): Promise<TenantSubscription> {
    const {user, tenant} = identity;
    const result = await this.service.billing.cancelSubscription({
      customerId: user.settings.stripeId,
      tenantId: tenant.normalizedNAme,
    }, setRpcContext(ctx)).toPromise();

    return result.subscription;
  }
}
