import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import * as faker from 'faker';
import { BioSex, UserSchema } from '../models/user.schema';
import { UserFilterInput, UserNewFilterInput } from './user.input';

@Resolver((of) => UserSchema)
export class UsersResolver {
  allUsers: UserSchema[] = [];

  constructor() {
    this.seedUser();
  }

  seedUser() {
    let count = 0;
    while(count < 10) {
      this.allUsers.push({
        firstName: faker.name.firstName(1),
        lastName: faker.name.lastName(1),
        id: faker.datatype.number(),
        sex: BioSex.Male,
        posts: [],
        updatedAt: faker.date.past(),
        createdAt: faker.date.past(),
      });
      count++;
    }
  }

  @Query((returns) => UserSchema)
  async user(@Args('id', { type: () => Int }) id: number) {
    return {};
  }

  @Query((returns) => [UserSchema], { nullable: true })
  async users(
    @Args('input', { type: () => UserFilterInput }) filter: UserFilterInput
  ) {
    return this.allUsers;
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
