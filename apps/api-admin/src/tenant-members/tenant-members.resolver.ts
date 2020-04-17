import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotImplementedError } from '@ultimatebackend/common';
import { TenantMemberEmbed } from '@ultimatebackend/repository';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Member as RpcMember} from '@ultimatebackend/proto-schema/tenant';
import { GqlAuthGuard, GqlContext, PermissionsInterceptor, Resource, setRpcContext, TenantsRpcClientService } from '@ultimatebackend/core';
import {
  Member, MemberFilterArgs, MemberFilterInput, MemberMutations,
} from './types';

@UseGuards(GqlAuthGuard)
@UseInterceptors(PermissionsInterceptor)
@Resolver(() => Member)
export class TenantMembersResolver {
  constructor(private readonly service: TenantsRpcClientService) {}

  @Mutation(() => MemberMutations, { name: 'member', nullable: true })
  async memberMutations() {
    return {};
  }

  @Resource({ roles: ['guest', 'member', 'admin', 'developer', 'owner'], name: 'member', identify: 'member', action: 'read' })
  @UseGuards(GqlAuthGuard)
  @Query(() => Member)
  async member(@Args('input') input: MemberFilterInput, @Context() ctx: GqlContext): Promise<TenantMemberEmbed> {
    throw new NotImplementedError('Not implemented');
  }

  @Resource({ roles: ['guest', 'member', 'admin', 'developer', 'owner'], name: 'member', identify: 'member', action: 'read' })
  @UseGuards(GqlAuthGuard)
  @Query(() => [Member!])
  async members(@Args() input: MemberFilterArgs, @Context() ctx: GqlContext): Promise<RpcMember[]> {
    const result = await this.service.tenantService.findMembers({
      filter: JSON.stringify(input.where)
    }, setRpcContext(ctx)).toPromise();

    return result.members;
  }
}
