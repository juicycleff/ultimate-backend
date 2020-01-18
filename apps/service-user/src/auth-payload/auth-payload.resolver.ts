import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { User } from '../types';
import { GetUserQuery } from '../cqrs';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthPayload } from '../types';

@Resolver(() => AuthPayload)
export class AuthPayloadResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ResolveProperty(() => User)
  async user(@Parent() auth: any): Promise<User> {
    const user = await this.queryBus.execute(new GetUserQuery({ id: auth.id }));
    return plainToClass(User, user);
  }
}
