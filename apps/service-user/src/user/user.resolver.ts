import { Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/core';
import { User } from '../types';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '@graphqlcqrs/repository/entities';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from '../cqrs';
import { CurrentUser } from '@graphqlcqrs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async me(@CurrentUser() curUser: UserEntity): Promise<User> {
    const authUser = await this.queryBus.execute(new GetUserQuery({
      id: {
        _EQ: curUser.id,
      },
    }));
    return plainToClass(User, authUser);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveProperty()
  primaryEmail(@Parent() parent: UserEntity): string {
    return parent.emails.reduce(previousValue => previousValue.primary && previousValue).address;
  }
}
