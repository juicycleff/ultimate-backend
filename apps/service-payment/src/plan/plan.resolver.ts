import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Plan, PlanFilterInput, PlanMutationInput } from '../types';
import { NotImplementedError } from '@graphqlcqrs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { PlanEntity } from '@graphqlcqrs/repository';
import { GqlAuthGuard, Permission, Resource } from '@graphqlcqrs/core';
import { CreatePlanCommand, DeletePlanCommand, GetPlanQuery, GetPlansQuery, UpdatePlanCommand } from '../cqrs';
import { UseGuards } from '@nestjs/common';

@Resource({ name: 'plan_manage', identify: 'plan:manage' })
@Resolver(() => Plan)
export class PlanResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permission({ name: 'plan', identify: 'plan:plan', action: 'read' })
  @Query(() => Plan)
  async plan(@Args('id') id: string): Promise<Plan> {
    return await this.queryBus.execute(new GetPlanQuery(id));
  }

  @Permission({ name: 'plans', identify: 'plan:plans', action: 'read' })
  @Query(() => [Plan])
  async plans(@Args('where') input: PlanFilterInput): Promise<Plan[]> {
    return await this.queryBus.execute(new GetPlansQuery(input));
  }

  @UseGuards(GqlAuthGuard)
  @Permission({ name: 'plan_mutations', identify: 'plan:planMutations', action: 'create' })
  @Mutation(() => Plan, { name: 'plan'})
  async planMutations(@Args() input: PlanMutationInput): Promise<PlanEntity> {
    const { create, delete: remove, update } = input;

    if (create) {
      return await this.commandBus.execute(new CreatePlanCommand(create));
    } else if (update) {
      return await this.commandBus.execute(new UpdatePlanCommand(update.id, update.data));
    } else if (remove) {
      return await this.commandBus.execute(new DeletePlanCommand(remove));
    } else {
      throw new NotImplementedError('Not implemented method');
    }
  }
}
