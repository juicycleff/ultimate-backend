import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, RolesRpcClientService } from '@ultimatebackend/core';
import { ProfileMutations, UpdateUserInput, User } from './types';
import { UserInputError } from 'apollo-server-express';

@Resolver(() => ProfileMutations)
export class UsersMutationResolver {
  constructor(private readonly services: RolesRpcClientService, private readonly rolesService: RolesRpcClientService) {}

  @ResolveField(() => User)
  @UseGuards(GqlAuthGuard)
  update(@Args('input') input: UpdateUserInput): string {
    throw new UserInputError('Mutation inputs missing');
  }
}
