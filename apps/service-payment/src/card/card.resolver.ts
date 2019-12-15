import { Resolver, Query, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql';
import { Card } from '@ultimatebackend/contracts';
import { UserEntity } from '@graphqlcqrs/repository';
import { CurrentUser, NotImplementedError } from '@graphqlcqrs/common';
import { AddPaymentMethodCommand, GetCardQuery, GetCardsQuery, RemovePaymentMethodCommand, UpdatePaymentMethodCommand } from '../cqrs';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CardMutationInput } from '../types';

@Resolver(() => Card)
export class CardResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => Card)
  async card(@Args('id') id: string, @CurrentUser() user: UserEntity): Promise<Card> {
    return await this.queryBus.execute(new GetCardQuery(id, user));
  }

  @Query(() => [Card])
  async cards(@CurrentUser() user: UserEntity): Promise<Card[]> {
    return await this.queryBus.execute(new GetCardsQuery(user));
  }

  @Mutation(() => Card, { name: 'card'})
  async cardMutations(@Args() input: CardMutationInput, @CurrentUser() user: UserEntity): Promise<Card> {
    const { create, delete: remove, update } = input;

    if (create) {
      return await this.commandBus.execute(new AddPaymentMethodCommand(create, user));
    } else if (update) {
      return await this.commandBus.execute(new UpdatePaymentMethodCommand(update, user));
    } else if (remove) {
      return await this.commandBus.execute(new RemovePaymentMethodCommand(remove, user));
    } else {
      throw new NotImplementedError('Not implemented method');
    }
  }

  @ResolveProperty('number')
  number(@Parent() card: Card): string {
    return `************${card.lastFourDigit}`;
  }
}
