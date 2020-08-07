import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import {
  DeleteAccessTokenInput,
  AccessToken,
  AccessTokenMutations,
  CreateAccessTokenInput,
} from './types';
import {
  GqlContext,
  Resource,
  setRpcContext,
  GqlAuthGuard,
} from '@ultimatebackend/core';
import { UseGuards } from '@nestjs/common';

@Resolver(() => AccessTokenMutations)
export class AccessTokenMutationResolver {
  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'access_token',
    identify: 'access_token',
    roles: ['owner', 'admin'],
    action: 'delete',
  })
  @ResolveField(() => AccessToken)
  async delete(
    @Args('input') input: DeleteAccessTokenInput,
    @Context() ctx: GqlContext,
  ): Promise<AccessToken> {
    const res = await ctx?.rpc?.accessToken?.svc
      .deleteAccess(
        {
          id: input.id,
          tenantId: input?.tenantId,
        },
        setRpcContext(ctx),
      )
      .toPromise();
    return (res.accessToken as unknown) as AccessToken;
  }

  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'access_token',
    identify: 'access_token',
    roles: ['owner', 'admin'],
    action: 'create',
  })
  @ResolveField(() => AccessToken)
  async create(
    @Args('input') input: CreateAccessTokenInput,
    @Context() ctx: GqlContext,
  ): Promise<AccessToken> {
    const res = await ctx?.rpc?.accessToken?.svc
      .createAccess(
        {
          name: input.name,
          scopes: input.scopes,
          tenantId: input?.tenantId,
          expireAt: input?.expireAt,
        },
        setRpcContext(ctx),
      )
      .toPromise();
    return (res.accessToken as unknown) as AccessToken;
  }
}
