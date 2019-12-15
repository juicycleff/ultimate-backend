import { Resolver, Query } from '@nestjs/graphql';
import { Billing } from '../types';
import { NotImplementedError } from '@graphqlcqrs/common';
import { OfferEntity } from '@graphqlcqrs/repository';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Resolver(() => Billing)
export class BillingResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => Billing)
  billing(): Promise<OfferEntity> {
    throw new NotImplementedError('Not implemented yet');
  }
}
