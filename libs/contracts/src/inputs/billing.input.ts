/* tslint:disable:max-classes-per-file */
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class AddressInput {

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  zip?: string;

  @Field({ nullable: true })
  line?: string;

  @Field({ nullable: true })
  line2?: string;
}

@InputType()
export class CardInput {

  @Field()
  name: string;

  @Field()
  cvc: string;

  @Field()
  number: string;

  @Field({ nullable: true })
  currency?: string;

  @Field(() => AddressInput)
  address?: AddressInput;

  @Field(() => Int)
  expMonth: number;

  @Field(() => Int)
  expYear: number;
}
