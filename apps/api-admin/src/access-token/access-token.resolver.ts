import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  AccessToken,
  AccessTokenFilterArgs,
  AccessTokenMutations,
  ReadAccessTokenInput,
} from './types';
import {
  GqlAuthGuard,
  GqlContext,
  Resource,
  setRpcContext,
} from '@ultimatebackend/core';
import { UseGuards } from '@nestjs/common';

@Resolver(() => AccessToken)
export class AccessTokenResolver {
  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'access_token',
    identify: 'access_token',
    roles: ['owner', 'admin', 'developer'],
    action: 'read',
  })
  @Query(() => [AccessToken], { nullable: true })
  async accessTokens(
    @Args() input: AccessTokenFilterArgs,
    @Context() ctx: GqlContext,
  ): Promise<AccessToken[]> {
    let t;
    let r;
    if (input?.where) {
      const { tenantId, ...rest } = input?.where;
      t = tenantId;
      r = rest;
    }

    const res = await ctx?.rpc?.accessToken?.svc
      .findAccess(
        {
          filter: JSON.stringify(r),
          tenantId: t,
        },
        setRpcContext(ctx),
      )
      .toPromise();
    return (res.accessToken as unknown) as AccessToken[];
  }

  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'access_token',
    identify: 'access_token',
    roles: ['owner', 'admin', 'developer'],
    action: 'read',
  })
  @Query(() => AccessToken, { nullable: true })
  async accessToken(
    @Args('input') input: ReadAccessTokenInput,
    @Context() ctx: GqlContext,
  ): Promise<AccessToken> {
    const res = await ctx?.rpc?.accessToken?.svc
      .readAccess(
        {
          id: input?.id,
          tenantId: input?.tenantId,
        },
        setRpcContext(ctx),
      )
      .toPromise();
    return (res.accessToken as unknown) as AccessToken;
  }

  @Mutation(() => AccessTokenMutations, { nullable: true, name: 'accessToken' })
  async accessTokenMutation() {
    return {};
  }
}
