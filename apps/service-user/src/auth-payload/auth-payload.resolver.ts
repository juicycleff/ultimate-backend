import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { ObjectID } from 'bson';
import { plainToClass } from 'class-transformer';
import { User } from '../graphql';
import { UserService } from '../user/user.service';

@Resolver('AuthPayload')
export class AuthPayloadResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveProperty('user')
  async user(@Parent() auth: any): Promise<User> {
    return plainToClass(User, await this.userService.findOne({ id: auth.id }));
  }
}
