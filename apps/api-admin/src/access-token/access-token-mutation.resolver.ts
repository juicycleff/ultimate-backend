import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import {
  DeleteAccessTokenInput,
  AccessToken,
  AccessTokenMutations, CreateAccessTokenInput,
} from './types';
import { GqlContext, Resource, AccessTokenRpcClientService, setRpcContext, GqlAuthGuard } from '@ultimatebackend/core';
import { UseGuards } from '@nestjs/common';

@Resolver(() => AccessTokenMutations)
export class AccessTokenMutationResolver {
  constructor(private readonly service: AccessTokenRpcClientService) {}

  @Resource({ name: 'access_token', identify: 'access_token', roles: ['owner', 'admin'], action: 'delete' })
  @UseGuards(GqlAuthGuard)
  @ResolveField(() => AccessToken)
  async delete(@Args('input') input: DeleteAccessTokenInput, @Context() ctx: GqlContext): Promise<AccessToken> {
    const res = await this.service.accessToken.deleteAccess({ id: input.id }, setRpcContext(ctx)).toPromise();
    return res.accessToken as AccessToken;
  }

  @Resource({ name: 'access_token', identify: 'access_token', roles: ['owner', 'admin'], action: 'create' })
  @UseGuards(GqlAuthGuard)
  @ResolveField(() => AccessToken)
  async create(@Args('input') input: CreateAccessTokenInput, @Context() ctx: GqlContext): Promise<AccessToken> {
    const res = await this.service.accessToken.createAccess(
      { name: input.name, scopes: input.scopes, tenantId: null,
      }, setRpcContext(ctx)).toPromise();
    return res.accessToken as AccessToken;
  }
}
