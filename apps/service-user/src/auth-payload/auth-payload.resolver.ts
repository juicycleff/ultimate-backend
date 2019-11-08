import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { User } from '../graphql';
import { GetUserQuery } from '@graphqlcqrs/core/cqrs';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Resolver('AuthPayload')
export class AuthPayloadResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ResolveProperty('user')
  async user(@Parent() auth: any): Promise<User> {
    const user = await this.queryBus.execute(new GetUserQuery({ id: auth.id }));
    return plainToClass(User, user);
  }
}
