import { Args, Query, Resolver } from '@nestjs/graphql';
import { NotImplementedError } from '@ultimatebackend/common';
import { Role } from './types';

@Resolver(Role)
export class RolesResolver {
  @Query(() => [Role])
  async roles() {
    throw new NotImplementedError('Not implemented');
  }

  @Query(() => Role)
  async role(@Args('id') id: string) {
    throw new NotImplementedError('Not implemented');
  }
}
