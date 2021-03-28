import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserSchema } from '../models/user.schema';
import { UserFilterInput, UserNewFilterInput } from './user.input';

@Resolver((of) => UserSchema)
export class UsersResolver {
  @Query((returns) => UserSchema)
  async user(@Args('id', { type: () => Int }) id: number) {
    return {};
  }

  @Query((returns) => [UserSchema], { nullable: true })
  async users(
    @Args('input', { type: () => UserFilterInput }) filter: UserFilterInput
  ) {
    return [];
  }

  @Query((returns) => [UserSchema], { nullable: true })
  async newUsers(
    @Args('input', { type: () => UserNewFilterInput })
    filter: UserNewFilterInput
  ) {
    return [];
  }

  @ResolveField()
  async posts(@Parent() user: UserSchema) {
    const { id } = user;
    return {};
  }
}
