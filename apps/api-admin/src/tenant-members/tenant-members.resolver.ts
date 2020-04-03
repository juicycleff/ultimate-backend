import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentTenant, NotImplementedError } from '@ultimatebackend/common';
import { TenantEntity, TenantMemberEmbed } from '@ultimatebackend/repository';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GqlAuthGuard, Permission, PermissionsInterceptor } from '@ultimatebackend/core';
import {
  Member, MemberFilterArgs, MemberFilterInput, MemberMutations,
} from './types';

@UseGuards(GqlAuthGuard)
@UseInterceptors(PermissionsInterceptor)
@Resolver(() => Member)
export class TenantMembersResolver {

  @Mutation(() => MemberMutations, { name: 'member', nullable: true })
  async memberMutations() {
    return {};
  }

  @Permission({ name: 'member', identify: 'member', action: 'read' })
  @Query(() => Member)
  async member(@Args('input') input: MemberFilterInput, @CurrentTenant() tenant: TenantEntity): Promise<TenantMemberEmbed> {
    throw new NotImplementedError('Not implemented');
  }

  @Permission({ name: 'member', identify: 'member', action: 'read' })
  @Query(() => [Member!])
  async members(@Args() input: MemberFilterArgs, @CurrentTenant() tenant: TenantEntity): Promise<TenantMemberEmbed> {
    throw new NotImplementedError('Not implemented');
  }
}
