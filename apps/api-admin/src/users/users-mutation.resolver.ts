import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { ProfileMutations, UpdateUserInput, User } from './types';
import { UserInputError } from 'apollo-server-express';

@Resolver(() => ProfileMutations)
export class UsersMutationResolver {
  @ResolveField(() => User)
  update(@Args('input') input: UpdateUserInput): string {
    throw new UserInputError('Mutation inputs missing');
  }
}
