import { Context, Mutation, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { Account, AccountMutations } from './types';

@Resolver(() => Account)
export class AccountsResolver {
  logger = new Logger(this.constructor.name);

  @Mutation(() => AccountMutations, { nullable: true })
  account(@Context() context: any) {
    // Magic
    return {};
  }
}
