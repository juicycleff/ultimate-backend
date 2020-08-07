import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Address } from '@ultimatebackend/contracts';

@ObjectType()
export class Card {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field()
  name: string;

  @Field()
  cvc: string;

  @Field({ nullable: true })
  number: string;

  @Field({ nullable: true })
  brand?: string;

  @Field({ nullable: true })
  lastFourDigit?: string;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  isDefault?: boolean;

  @Field(() => Address, { nullable: true })
  address?: Address;

  @Field(() => Int)
  @Field()
  expMonth: number;

  @Field(() => Int)
  expYear: number;
}

@ObjectType()
export class CardMutations {}
