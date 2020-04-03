import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import { TenantMemberEmbed } from '@ultimatebackend/repository';
import {
  InviteMemberInput,
  MemberMutations,
  DeleteMemberInput,
  Member,
  UpdateMemberInput,
} from './types';
import { GqlAuthGuard, GqlContext, Resource, setRpcContext, TenantsRpcClientService } from '@ultimatebackend/core';
import { UseGuards } from '@nestjs/common';

@Resolver(() => MemberMutations)
export class TenantMembersMutationResolver {
  constructor(private readonly service: TenantsRpcClientService) {}

  @Resource({ name: 'member', identify: 'member', roles: ['owner', 'admin'], action: 'delete' })
  @ResolveField(() => Member)
  async invite(@Args('input') input: InviteMemberInput, @Context() ctx: GqlContext): Promise<TenantMemberEmbed> {
    const result = await this.service.tenantService.inviteMember({
      email: input.email,
      role: input.role,
      userId: input.userId,
    }, setRpcContext(ctx)).toPromise();
    // @ts-ignore
    return result.tenant;
  }

  @Resource({ name: 'member', identify: 'member', roles: ['owner', 'admin'], action: 'delete' })
  @ResolveField(() => Member)
  async update(@Args('input') input: UpdateMemberInput, @Context() ctx: GqlContext): Promise<TenantMemberEmbed> {
    const result = await this.service.tenantService.updateMember({
      role: input.role,
      id: input.id,
      status: null,
    }, setRpcContext(ctx)).toPromise();
    // @ts-ignore
    return result.tenant;
  }

  @Resource({ name: 'member', identify: 'member', roles: ['owner', 'admin'], action: 'delete' })
  @ResolveField(() => Member)
  async delete(@Args('input') input: DeleteMemberInput, @Context() ctx: GqlContext): Promise<TenantMemberEmbed> {
    const result = await this.service.tenantService.deleteMember({
      id: input.id,
    }, setRpcContext(ctx)).toPromise();
    // @ts-ignore
    return result.tenant;
  }
}
