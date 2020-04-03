import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Tenant, TenantFilterArgs, TenantFilterInput, TenantMutations } from './types';
import { GqlAuthGuard, PermissionsInterceptor, setRpcContext } from '@ultimatebackend/core';
import { GqlContext, Resource, TenantsRpcClientService } from '@ultimatebackend/core';
import { UseGuards, UseInterceptors } from '@nestjs/common';

@UseInterceptors(PermissionsInterceptor)
@Resolver(() => Tenant)
export class TenantsResolver {
  constructor(private readonly service: TenantsRpcClientService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TenantMutations, {name: 'tenant', nullable: true})
  async tenantMutation() {
    return {};
  }

  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'tenant',
    identify: 'tenant',
    roles: ['admin', 'developer', 'member', 'owner', 'guest', 'customer'],
    action: 'read',
  })
  @Query(() => Tenant, {nullable: true})
  async tenant(@Args('filter') filter: TenantFilterInput, @Context() ctx: GqlContext): Promise<Tenant> {
    const result = await this.service.tenantService.readTenant({ filter: JSON.stringify(filter) }, setRpcContext(ctx)).toPromise();
    // @ts-ignore
    return result.tenant;
  }

  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'tenant',
    identify: 'tenant',
    roles: ['admin', 'developer', 'member', 'owner', 'guest', 'customer'],
    action: 'read',
  })
  @Query(() => [Tenant], {nullable: true})
  async tenants(@Args() { where, paginate }: TenantFilterArgs, @Context() ctx: GqlContext): Promise<Tenant[]> {
    const filter = JSON.stringify(where);
    const result = await this.service.tenantService.findTenant({ filter }, setRpcContext(ctx)).toPromise();
    // @ts-ignore
    return result.tenants;
  }
}
