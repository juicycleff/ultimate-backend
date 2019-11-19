import { Args, Query, Resolver } from '@nestjs/graphql';
import { Plan } from '../types/plans.types';

@Resolver(() => Plan)
export class PlansResolver {

  @Query()
  async plans() {

  }

  @Query()
  async plan(@Args('id') id: string) {

  }
}
