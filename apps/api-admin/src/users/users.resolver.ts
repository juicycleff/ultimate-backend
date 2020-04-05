import { Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AccountsRpcClientService, GqlAuthGuard, GqlContext, RolesRpcClientService } from '@ultimatebackend/core';
import { ProfileMutations, User } from './types';
import { CurrentUser } from '@ultimatebackend/common';
import { UserEntity } from '@ultimatebackend/repository';
import * as Account from '@ultimatebackend/proto-schema/account';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly services: AccountsRpcClientService, private readonly rolesService: RolesRpcClientService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async profile(@CurrentUser() curUser: UserEntity, @Context() context: GqlContext): Promise<Account.User> {
    // @ts-ignore
    return context.getUser();
  }

  @Mutation(() => ProfileMutations, {name: 'profile', nullable: true})
  async profileMutation() {
    return {};
  }

  @ResolveField()
  primaryEmail(@Parent() parent: UserEntity): string {
    return parent.emails.reduce(previousValue => previousValue.primary && previousValue).address;
  }

  @ResolveField()
  async roles(@Parent() parent: UserEntity): Promise<string[]> {
    const rolesResponse = await this.rolesService.roleService.readUserRoles({
      userId: parent.id.toString(),
      tenant: '*',
    }).toPromise();
    return rolesResponse.roles;
  }
}
