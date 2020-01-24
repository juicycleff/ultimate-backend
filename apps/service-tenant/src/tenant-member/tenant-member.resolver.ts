import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TenantMemberEmbed } from '@graphqlcqrs/repository';
import { TenantMemberMutationArgs, TenantMember, TenantMemberFilterArgs } from '../types';
import { NotImplementedError } from '@graphqlcqrs/common';
import { GqlAuthGuard, Permission, Resource } from '@graphqlcqrs/core';
import { UseGuards } from '@nestjs/common';

@UseGuards(GqlAuthGuard)
@Resource({ name: 'tenant_member_manage', identify: 'tenantMember:manage' })
@Resolver(() => TenantMember)
export class TenantMemberResolver {

  @Permission({ name: 'tenant_member_mutations', identify: 'tenantMember:tenantMemberMutations', action: 'create' })
  @Mutation(() => TenantMember, { name: 'tenantMember' })
  async tenantMemberMutations(@Args() input: TenantMemberMutationArgs): Promise<TenantMemberEmbed> {
    const { create, remove, update } = input;

    if (create) {
      throw new NotImplementedError('Not implemented');
    } else if (remove) {
      throw new NotImplementedError('Not implemented');
    } else if (update) {
      throw new NotImplementedError('Not implemented');
    } else {
      throw new NotImplementedError('Not implemented');
    }
  }

  @Permission({ name: 'tenant_member', identify: 'tenantMember:tenantMember', action: 'read' })
  @Query(() => TenantMember)
  async tenantMember(@Args('id') id: string): Promise<TenantMemberEmbed> {
    return null;
  }

  @Permission({ name: 'tenant_members', identify: 'tenantMember:tenantMembers', action: 'read' })
  @Query(() => [TenantMember!])
  async tenantMembers(@Args() input: TenantMemberFilterArgs): Promise<TenantMemberEmbed> {
    return null;
  }
}
