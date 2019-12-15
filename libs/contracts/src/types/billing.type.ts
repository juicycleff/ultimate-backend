/* tslint:disable:max-classes-per-file */
import { ObjectType, Field, ID, Int } from 'type-graphql';

@ObjectType()
export class Address {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  line?: string;

  @Field({ nullable: true })
  line2?: string;
}

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

  @Field(() => Address, { nullable: true })
  address?: Address;

  @Field(() => Int)
  @Field()
  expMonth: number;

  @Field(() => Int)
  expYear: number;
}
