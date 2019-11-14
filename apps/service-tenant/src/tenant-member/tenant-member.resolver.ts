import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TenantMember } from '../types/tenant-member.type';
import { TenantMemberEmbed } from '@graphqlcqrs/repository';
import { PaginationArgs } from '@ultimatebackend/contracts';

@Resolver(() => TenantMember)
export class TenantMemberResolver {

  @Mutation(() => TenantMember)
  async inviteTenantMember(@Args('id') id: string): Promise<TenantMemberEmbed> {
    return null;
  }

  @Mutation(() => TenantMember)
  async updateTenantMember(@Args('id') id: string): Promise<TenantMemberEmbed> {
    return null;
  }

  @Mutation(() => TenantMember)
  async removeTenantMember(@Args('id') id: string): Promise<TenantMemberEmbed> {
    return null;
  }

  @Query(() => TenantMember)
  async tenantMember(@Args('id') id: string): Promise<TenantMemberEmbed> {
    return null;
  }

  @Query(() => TenantMember)
  async tenantMembers(@Args() paginate: PaginationArgs): Promise<TenantMemberEmbed> {
    return null;
  }
}
