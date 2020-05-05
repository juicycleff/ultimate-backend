import { Args, Context, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { BillingsRpcClientService, setRpcContext, GqlContext, GqlAuthGuard, Resource } from '@ultimatebackend/core';
import { Card, CardMutations, CreateCardInput } from './types';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Card)
export class CardsResolver {
  constructor(private readonly service: BillingsRpcClientService) {}

  @Resource({ name: 'billing', identify: 'billing:card', roles: ['customer'], action: 'read' })
  @UseGuards(GqlAuthGuard)
  @Query(() => Card, {nullable: true})
  async card(@Args('id') id: string, @Context() ctx: GqlContext): Promise<Card> {
    const result = await this.service.billing.readCard({id}, setRpcContext(ctx)).toPromise();
    return result.card;
  }

  @Resource({ name: 'billing', identify: 'billing:card', roles: ['customer'], action: 'read' })
  @UseGuards(GqlAuthGuard)
  @Query(() => [Card], {nullable: true})
  async cards(@Context() ctx: GqlContext): Promise<Card[]> {
    const result = await this.service.billing.findCards({}, setRpcContext(ctx)).toPromise();
    return result.cards;
  }

  @Mutation(() => CardMutations, {nullable: true, name: 'card'})
  async cardMutation() {
    return {};
  }
}

/**
 * @class
 * @classdesc card nested mutation
 */
@Resolver(() => CardMutations)
export class CardsMutationResolver {
  constructor(private readonly service: BillingsRpcClientService) {
  }

  /**
   * @description create card mutation
   * @param input
   * @param ctx
   */
  @Resource({ name: 'billing', identify: 'billing:card', roles: ['customer'], action: 'update' })
  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Card)
  async create(@Args('input') input: CreateCardInput, @Context() ctx: GqlContext): Promise<Card> {
    // @ts-ignore
    const result = await this.service.billing.createCard({...input}, setRpcContext(ctx)).toPromise();
    return result.card;
  }

  /**
   * @description delete card mutation
   * @param id
   * @param ctx
   */
  @Resource({ name: 'billing', identify: 'billing:card', roles: ['customer'], action: 'update' })
  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Card)
  async delete(@Args('id') id: string, @Context() ctx: GqlContext): Promise<Card> {
    const result = await this.service.billing.deleteCard({id}, setRpcContext(ctx)).toPromise();
    return result.card;
  }

  /*
  @ResolveField(() => [Card])
  async updateCard(@Context() ctx: GqlContext): Promise<Card> {
    const result = await this.service.billing.({}, setRpcContext(ctx)).toPromise();
    return result.cards;
  }
  */
}
