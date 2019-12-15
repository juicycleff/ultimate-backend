import { Args, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/core';
import { User } from '../types';
import { ObjectID } from 'bson';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '@graphqlcqrs/repository/entities';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from '../cqrs';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async user(@Args('id') id: string): Promise<User> {
    const user = await this.queryBus.execute(new GetUserQuery({ id: new ObjectID(id) }));
    return plainToClass(User, user);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveProperty()
  primaryEmail(@Parent() parent: UserEntity): string {
    return parent.emails.reduce(previousValue => previousValue.primary && previousValue).address;
  }
}
