import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccessToken, AccessTokenMutations, DeleteAccessTokenInput } from './types';
import { AccessTokenRpcClientService, GqlContext, Resource, setRpcContext } from '@ultimatebackend/core';

@Resolver(() => AccessToken)
export class AccessTokenResolver {
  constructor(private readonly service: AccessTokenRpcClientService) {}

  @Resource({ name: 'access_token', identify: 'access_token', roles: ['owner', 'admin', 'developer'], action: 'read' })
  @Query(() => [AccessToken])
  async accessTokens(
    @Args('input') input: DeleteAccessTokenInput,
    @Context() ctx: GqlContext): Promise<AccessToken[]> {
    const res = await this.service.accessToken.findAccess({ id: null, tenantId: null }, setRpcContext(ctx)).toPromise();
    return res.accessToken as AccessToken[];
  }

  @Resource({ name: 'access_token', identify: 'access_token', roles: ['owner', 'admin', 'developer'], action: 'read' })
  @Query(() => AccessToken)
  async accessToken(@Args('id') id: string, @Context() ctx: GqlContext): Promise<AccessToken> {
    const res = await this.service.accessToken.readAccess(
      {
        id, tenantId: null,
      }, setRpcContext(ctx)).toPromise();
    return res.accessToken as AccessToken;
  }

  @Mutation(() => AccessTokenMutations, {nullable: true, name: 'accessToken'})
  async accessTokenMutation() {
    return {};
  }
}
