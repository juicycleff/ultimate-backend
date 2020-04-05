import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentTenant, NotImplementedError } from '@ultimatebackend/common';
import { TenantEntity, TenantMemberEmbed } from '@ultimatebackend/repository';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GqlAuthGuard, PermissionsInterceptor, Resource, TenantsRpcClientService } from '@ultimatebackend/core';
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
  async member(@Args('input') input: MemberFilterInput, @CurrentTenant() tenant: TenantEntity): Promise<TenantMemberEmbed> {
    throw new NotImplementedError('Not implemented');
  }

  @Resource({ roles: ['guest', 'member', 'admin', 'developer', 'owner'], name: 'member', identify: 'member', action: 'read' })
  @UseGuards(GqlAuthGuard)
  @Query(() => [Member!])
  async members(@Args() input: MemberFilterArgs, @CurrentTenant() tenant: TenantEntity): Promise<TenantMemberEmbed> {
    throw new NotImplementedError('Not implemented');
  }
}
