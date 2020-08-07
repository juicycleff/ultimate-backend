import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  Tenant,
  TenantFilterArgs,
  TenantFilterInput,
  TenantMutations,
} from './types';
import {
  GqlAuthGuard,
  PermissionsInterceptor,
  setRpcContext,
} from '@ultimatebackend/core';
import { GqlContext, Resource } from '@ultimatebackend/core';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from '../users/types';
import { Tenant as RpcTenant } from '@ultimatebackend/proto-schema/tenant';
import { User as RpcUser } from '@ultimatebackend/proto-schema/account';

@UseInterceptors(PermissionsInterceptor)
@Resolver(() => Tenant)
export class TenantsResolver {
  @Mutation(() => TenantMutations, { name: 'tenant', nullable: true })
  tenantMutation() {
    return {};
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Boolean, { nullable: true })
  async tenantAvailable(
    @Args('identifier') identifier: string,
    @Context() ctx: GqlContext,
  ): Promise<boolean> {
    const result = await ctx?.rpc?.tenant.svc
      .tenantAvailable(
        {
          identifier,
        },
        null,
      )
      .toPromise();
    return !result.available;
  }

  @Resource({
    name: 'tenant',
    identify: 'tenant',
    roles: ['admin', 'developer', 'member', 'owner', 'guest', 'customer'],
    action: 'read',
  })
  @UseGuards(GqlAuthGuard)
  @Query(() => Tenant, { nullable: true })
  async tenant(
    @Args('filter') filter: TenantFilterInput,
    @Context() ctx: GqlContext,
  ): Promise<RpcTenant> {
    const result = await ctx?.rpc?.tenant.svc
      .readTenant({ filter: JSON.stringify(filter) }, setRpcContext(ctx))
      .toPromise();

    return result.tenant;
  }

  @Resource({
    name: 'tenant',
    identify: 'tenant',
    roles: ['admin', 'developer', 'member', 'owner', 'guest', 'customer'],
    action: 'read',
  })
  @UseGuards(GqlAuthGuard)
  @Query(() => [Tenant], { nullable: true })
  async tenants(
    @Args() { where, paginate }: TenantFilterArgs,
    @Context() ctx: GqlContext,
  ): Promise<RpcTenant[]> {
    const filter = JSON.stringify(where);
    const result = await ctx?.rpc?.tenant.svc
      .findTenant({ filter }, setRpcContext(ctx))
      .toPromise();

    return result.tenants;
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => User, { nullable: true })
  async owner(
    @Parent() parent: Tenant,
    @Context() ctx: GqlContext,
  ): Promise<RpcUser> {
    const filter = {
      id: {
        _EQ: parent.createdBy,
      },
    };
    const result = await ctx?.rpc?.account.svc
      .read(
        {
          query: JSON.stringify(filter),
        },
        setRpcContext(ctx),
      )
      .toPromise();

    return result.user;
  }
}
