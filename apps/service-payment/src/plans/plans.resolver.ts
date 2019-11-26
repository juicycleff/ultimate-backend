import { Args, Query, Resolver } from '@nestjs/graphql';
import { Plan } from '../types/plans.types';
import { NotImplementedError } from '@graphqlcqrs/common/errors';

@Resolver(() => Plan)
export class PlansResolver {

  @Query()
  async plans() {
    throw new NotImplementedError('Not implemented');
  }

  @Query()
  async plan(@Args('id') id: string) {
    throw new NotImplementedError('Not implemented');
  }
}
