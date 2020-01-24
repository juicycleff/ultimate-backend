import { Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { GetTenantsQuery } from '../cqrs/query/impl/tenant';
import { Tenant, User } from '../types';
import { ObjectID } from 'bson';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/core';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveProperty()
  async tenants(@Parent() parent: User): Promise<Tenant[]> {
    return await this.queryBus.execute(new GetTenantsQuery({
     members: {$elemMatch: { userId: new ObjectID(parent.id)}},
    }));
  }
}
