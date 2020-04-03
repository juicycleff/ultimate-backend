import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import {
  CreateTenantInput,
  DeleteTenantInput,
  Tenant,
  TenantMutations,
  UpdateTenantInput,
} from './types';
import { CurrentUser } from '@ultimatebackend/common';
import { TenantEntity, UserEntity } from '@ultimatebackend/repository';
import { GqlAuthGuard, GqlContext, Resource, setRpcContext, TenantsRpcClientService } from '@ultimatebackend/core';
import { UseGuards } from '@nestjs/common';

@UseGuards(GqlAuthGuard)
@Resolver(() => TenantMutations)
export class TenantsMutationResolver {
  constructor(private readonly service: TenantsRpcClientService) {}

  @Resource({ name: 'tenant', identify: 'tenant', roles: ['owner', 'admin'], action: 'create' })
  @ResolveField(() => Tenant)
  async create(@Args('input') input: CreateTenantInput, @Context() ctx: GqlContext, @CurrentUser() user: UserEntity): Promise<TenantEntity> {
    // @ts-ignore
    const result = await this.service.tenantService.createTenant({ ...input }, setRpcContext(ctx)).toPromise();
    return result.tenant;
  }

  @Resource({ name: 'tenant', identify: 'tenant', roles: ['owner', 'admin'], action: 'update' })
  @ResolveField(() => Tenant)
  async update(@Args('input') input: UpdateTenantInput, @Context() ctx: GqlContext, @CurrentUser() user: UserEntity): Promise<TenantEntity> {

    const result = await this.service.tenantService.updateTenant({
      id: input.id,
      // @ts-ignore
      data: input.data,
    }, setRpcContext(ctx)).toPromise();
    return result.tenant;
  }

  @Resource({ name: 'tenant', identify: 'tenant', roles: ['owner', 'admin'], action: 'delete' })
  @ResolveField(() => Tenant)
  async delete(@Args('input') input: DeleteTenantInput, @Context() ctx: GqlContext, @CurrentUser() user: UserEntity): Promise<TenantEntity> {

    const result = await this.service.tenantService.deleteTenant({
      id: input.id,
    }, setRpcContext(ctx)).toPromise();
    // @ts-ignore
    return result.tenant;
  }
}
