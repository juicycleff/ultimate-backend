import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentTenant } from '@ultimatebackend/common';
import { TenantEntity, TenantMemberEmbed } from '@ultimatebackend/repository';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import {
  GqlAuthGuard,
  GqlContext,
  Permission,
  PermissionsInterceptor,
  setRpcContext,
} from '@ultimatebackend/core';
import { Member, MemberFilterArgs, MemberMutations } from './types';

@UseGuards(GqlAuthGuard)
@UseInterceptors(PermissionsInterceptor)
@Resolver(() => Member)
export class TenantMembersResolver {
  @Mutation(() => MemberMutations, { name: 'member', nullable: true })
  async memberMutations() {
    return {};
  }

  @Permission({ name: 'member', identify: 'member', action: 'read' })
  @UseGuards(GqlAuthGuard)
  @Query(() => Member)
  async member(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantEntity,
    @Context() ctx: GqlContext,
  ): Promise<TenantMemberEmbed> {
    const result = await ctx?.rpc?.tenant.svc
      .readMember(
        {
          id,
        },
        setRpcContext(ctx),
      )
      .toPromise();

    // @ts-ignore
    return result.member;
  }

  @Permission({ name: 'member', identify: 'member', action: 'read' })
  @UseGuards(GqlAuthGuard)
  @Query(() => [Member!], { nullable: true })
  async members(
    @Args() input: MemberFilterArgs,
    @Context() ctx: GqlContext,
  ): Promise<TenantMemberEmbed[]> {
    const result = await ctx?.rpc?.tenant.svc
      .findMembers(
        {
          status: input?.where?.status,
          tenantId: input?.where?.tenantId,
          role: input?.where?.role,
        },
        setRpcContext(ctx),
      )
      .toPromise();

    // @ts-ignore
    return result.members;
  }

  @Permission({ name: 'member', identify: 'member', action: 'read' })
  @UseGuards(GqlAuthGuard)
  @ResolveField(() => String, { name: 'displayName' })
  async fullName(
    @Parent() parent: Member,
    @Context() ctx: GqlContext,
  ): Promise<string> {
    const filter = {
      id: {
        _EQ: parent.userId,
      },
    };
    const result = await ctx?.rpc?.account.svc
      .read(
        {
          query: JSON.stringify(filter),
        },
        setRpcContext(ctx),
      )
      .toPromise();

    return `${result?.user?.firstname} ${result?.user?.lastname}`;
  }
}
