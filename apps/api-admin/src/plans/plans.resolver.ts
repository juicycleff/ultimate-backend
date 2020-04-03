import { Args, Resolver, Query, Parent, ResolveField } from '@nestjs/graphql';
import { Plan } from './types';
import { BillingsRpcClientService } from '@ultimatebackend/core';
import { Price } from '@ultimatebackend/contracts';

@Resolver(() => Plan)
export class PlansResolver {
  constructor(private readonly service: BillingsRpcClientService) {}

  @Query(() => Plan)
  async plan(@Args('id') id: string) {
    const result = await this.service.billing.readPlan({ id }).toPromise();
    return result.plan;
  }

  @Query(() => [Plan])
  async plans() {
    const result = await this.service.billing.findPlans({}).toPromise();
    return result.plans;
  }

  @ResolveField(() => [Price])
  async prices(@Parent() parent: Plan) {
    const result = await this.service.billing.findStripePlans({productId: parent.normalizedName}).toPromise();
    return result.plans;
  }
}
