import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TenantEntity, TenantMemberEmbed, UserEntity } from '@graphqlcqrs/repository';
import { TenantMemberMutationArgs, TenantMember, TenantMemberFilterInputArgs, TenantMemberFilterInput } from '../types';
import {
  GetTenantMemberQuery,
  GetTenantMembersQuery,
  InviteTenantMemberCommand,
  RemoveTenantMemberCommand,
  UpdateTenantMemberCommand,
} from '../cqrs';
import { CurrentTenant, CurrentUser, NotImplementedError } from '@graphqlcqrs/common';
import { GqlAuthGuard, Permission, Resource, TenantGuard } from '@graphqlcqrs/core';
import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@UseGuards(GqlAuthGuard)
@Resource({ name: 'tenant_member_manage', identify: 'tenantMember:manage' })
@Resolver(() => TenantMember)
export class TenantMemberResolver {

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permission({ name: 'tenant_member_mutations', identify: 'tenantMember:tenantMemberMutations', action: 'create' })
  @Mutation(() => TenantMember, { name: 'tenantMember' })
  async tenantMemberMutations(@Args() input: TenantMemberMutationArgs, @CurrentUser() user: UserEntity): Promise<TenantMemberEmbed> {
    const { invite, remove, update } = input;

    if (invite) {
      return await this.commandBus.execute(new InviteTenantMemberCommand(invite, user));
    } else if (remove) {
      return await this.commandBus.execute(new RemoveTenantMemberCommand(remove, user));
    } else if (update) {
      return await this.commandBus.execute(new UpdateTenantMemberCommand(update, user));
    } else {
      throw new NotImplementedError('Not implemented');
    }
  }

  @UseGuards(TenantGuard)
  @Permission({ name: 'tenant_member', identify: 'tenantMember:tenantMember', action: 'read' })
  @Query(() => TenantMember)
  async tenantMember(@Args('input') input: TenantMemberFilterInput, @CurrentTenant() tenant: TenantEntity): Promise<TenantMemberEmbed> {
    return this.queryBus.execute(new GetTenantMemberQuery(input, tenant.normalizedName));
  }

  @Permission({ name: 'tenant_members', identify: 'tenantMember:tenantMembers', action: 'read' })
  @Query(() => [TenantMember!])
  async tenantMembers(@Args() input: TenantMemberFilterInputArgs, @CurrentTenant() tenant: TenantEntity): Promise<TenantMemberEmbed> {
    return this.queryBus.execute(new GetTenantMembersQuery(input, tenant.normalizedName));
  }
}
