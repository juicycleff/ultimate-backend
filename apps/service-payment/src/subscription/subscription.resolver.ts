import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { CurrentTenant, CurrentUser } from '@graphqlcqrs/common';
import { TenantEntity, UserEntity } from '@graphqlcqrs/repository';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ChangeSubscriptionInput, TenantSubscription } from '../types';
import { GetSubscriptionQuery, GetSubscriptionsQuery, CancelSubscriptionCommand, ChangeSubscriptionCommand } from '../cqrs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/core';

@UseGuards(GqlAuthGuard)
@Resolver(() => TenantSubscription)
export class SubscriptionResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => TenantSubscription)
  async changeSubscription(
    @Args('input') input: ChangeSubscriptionInput,
    @CurrentUser() user: UserEntity,
    @CurrentTenant() tenant: TenantEntity,
  ): Promise<TenantSubscription> {
    return await this.commandBus.execute(new ChangeSubscriptionCommand({
      customerId: user.payment?.stripeId,
      userId: typeof user.id === 'string' ? user.id : user.id.toHexString(),
      tenantId: typeof tenant.id === 'string' ? tenant.id : tenant.id.toHexString(),
    }, {
      ...input,
    }));
  }

  @Mutation(() => TenantSubscription)
  async cancelSubscription(
    @CurrentUser() user: UserEntity,
    @CurrentTenant() tenant: TenantEntity,
  ): Promise<TenantSubscription> {
    return await this.commandBus.execute(new CancelSubscriptionCommand({
      customerId: user.payment?.stripeId,
      userId: typeof user.id === 'string' ? user.id : user.id.toHexString(),
      tenantId: typeof tenant.id === 'string' ? tenant.id : tenant.id.toHexString(),
    }));
  }

  @Query(() => TenantSubscription)
  async subscription(
    @Args('id') id: string,
  ): Promise<TenantSubscription> {
    return await this.queryBus.execute(new GetSubscriptionQuery(id));
  }

  @Query(() => [TenantSubscription])
  async subscriptions(
    @CurrentUser() user: UserEntity,
    @CurrentTenant() tenant: TenantEntity,
  ): Promise<TenantSubscription[]> {
    return await this.queryBus.execute(new GetSubscriptionsQuery({
      customerId: user.payment?.stripeId,
      userId: typeof user.id === 'string' ? user.id : user.id.toHexString(),
      tenantId: typeof tenant.id === 'string' ? tenant.id : tenant.id.toHexString(),
    }));
  }
}
