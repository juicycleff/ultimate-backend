import { Args, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/common/guards';
import { UserService } from './user.service';
import { User } from '../graphql';
import { ObjectID } from 'bson';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '@graphqlcqrs/repository/entities';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query('user')
  async user(@Args('id') id: string): Promise<User> {
    return plainToClass(User, await this.userService.findOne({ id: new ObjectID(id) }));
  }

  @UseGuards(GqlAuthGuard)
  @ResolveProperty()
  primaryEmail(@Parent() parent: UserEntity): string {
    return parent.emails.reduce(previousValue => previousValue.primary && previousValue).address;
  }
}
