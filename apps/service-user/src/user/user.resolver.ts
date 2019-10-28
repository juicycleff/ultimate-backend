import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/common/guards';
import { UserService } from './user.service';
import { User } from '../graphql';
import { ObjectID } from 'bson';
import { plainToClass } from 'class-transformer';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query('user')
  async user(@Args('id') id: string): Promise<User> {
    return plainToClass(User, await this.userService.findOne({ id: new ObjectID(id) }));
  }
}
