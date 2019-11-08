import { Args, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/common/guards';
import { User } from '../graphql';
import { ObjectID } from 'bson';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '@graphqlcqrs/repository/entities';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from '@graphqlcqrs/core/cqrs';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query('user')
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
