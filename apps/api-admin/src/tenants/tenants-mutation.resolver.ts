import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import {
  CreateTenantInput,
  DeleteTenantInput,
  Tenant,
  TenantMutations,
  UpdateTenantInput,
} from './types';
import {
  GqlAuthGuard,
  GqlContext,
  Resource,
  setRpcContext,
} from '@ultimatebackend/core';
import { UseGuards } from '@nestjs/common';
import {
  CreateTenantRequest,
  Tenant as RpcTenant,
  UpdateTenantRequest,
} from '@ultimatebackend/proto-schema/tenant';

@Resolver(() => TenantMutations)
export class TenantsMutationResolver {
  @Resource({
    name: 'tenant',
    identify: 'tenant',
    roles: ['owner', 'admin'],
    action: 'create',
  })
  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Tenant)
  async create(
    @Args('input') input: CreateTenantInput,
    @Context() ctx: GqlContext,
  ): Promise<RpcTenant> {
    const result = await ctx?.rpc?.tenant.svc
      .createTenant(CreateTenantRequest.fromJSON(input), setRpcContext(ctx))
      .toPromise();

    return result.tenant;
  }

  @Resource({
    name: 'tenant',
    identify: 'tenant',
    roles: ['owner', 'admin'],
    action: 'update',
  })
  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Tenant)
  async update(
    @Args('input') input: UpdateTenantInput,
    @Context() ctx: GqlContext,
  ): Promise<RpcTenant> {
    const result = await ctx?.rpc?.tenant.svc
      .updateTenant(
        UpdateTenantRequest.fromJSON({
          ...input.data,
          id: input.id,
        }),
        setRpcContext(ctx),
      )
      .toPromise();

    return result.tenant;
  }

  @Resource({
    name: 'tenant',
    identify: 'tenant',
    roles: ['owner', 'admin'],
    action: 'delete',
  })
  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Tenant)
  async delete(
    @Args('input') input: DeleteTenantInput,
    @Context() ctx: GqlContext,
  ): Promise<RpcTenant> {
    const result = await ctx?.rpc?.tenant.svc
      .deleteTenant(
        {
          id: input.id,
        },
        setRpcContext(ctx),
      )
      .toPromise();

    return result.tenant;
  }
}
