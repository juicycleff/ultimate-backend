import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  setRpcContext,
  GqlContext,
  Resource,
  GqlAuthGuard,
} from '@ultimatebackend/core';
import { Card, CardMutations, CreateCardInput } from './types';
import { UseGuards } from '@nestjs/common';
import { CreateCardRequest } from '@ultimatebackend/proto-schema/billing';

@Resolver(() => Card)
export class CardsResolver {
  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'billing',
    identify: 'billing:card',
    roles: ['customer'],
    action: 'read',
  })
  @Query(() => Card, { nullable: true })
  async card(
    @Args('id') id: string,
    @Context() ctx: GqlContext,
  ): Promise<Card> {
    const result = await ctx?.rpc?.billing?.svc
      .readCard({ id }, setRpcContext(ctx))
      .toPromise();
    return result.card;
  }

  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'billing',
    identify: 'billing:card',
    roles: ['customer'],
    action: 'read',
  })
  @Query(() => [Card], { nullable: true })
  async cards(@Context() ctx: GqlContext): Promise<Card[]> {
    const result = await ctx?.rpc?.billing?.svc
      .findCards({}, setRpcContext(ctx))
      .toPromise();
    return result.cards;
  }

  @Mutation(() => CardMutations, { nullable: true, name: 'card' })
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
  /**
   * @description create card mutation
   * @param input
   * @param ctx
   */
  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'billing',
    identify: 'billing:card',
    roles: ['customer'],
    action: 'update',
  })
  @ResolveField(() => Card)
  async create(
    @Args('input') input: CreateCardInput,
    @Context() ctx: GqlContext,
  ): Promise<Card> {
    const result = await ctx?.rpc?.billing?.svc
      .createCard(CreateCardRequest.fromJSON({ ...input }), setRpcContext(ctx))
      .toPromise();
    return result.card;
  }

  /**
   * @description delete card mutation
   * @param id
   * @param ctx
   */
  @UseGuards(GqlAuthGuard)
  @Resource({
    name: 'billing',
    identify: 'billing:card',
    roles: ['customer'],
    action: 'update',
  })
  @ResolveField(() => Card)
  async delete(
    @Args('id') id: string,
    @Context() ctx: GqlContext,
  ): Promise<Card> {
    const result = await ctx?.rpc?.billing?.svc
      .deleteCard({ id }, setRpcContext(ctx))
      .toPromise();
    return result.card;
  }

  /**
   * @description set a card as user default card
   * @param id
   * @param ctx
   */
  @ResolveField(() => Card)
  async setDefault(
    @Args('id') id: string,
    @Context() ctx: GqlContext,
  ): Promise<Card> {
    const result = await ctx?.rpc?.billing?.svc
      .setDefaultCard({ id }, setRpcContext(ctx))
      .toPromise();
    return result.card;
  }
}
