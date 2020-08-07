import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { AddressInput } from '@ultimatebackend/contracts';

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

@InputType()
export class CreateCardInput extends CardInput {}

@InputType()
export class UpdateCardInput {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  data: CardInput;
}

@InputType()
export class DeleteCardInput {
  @Field(() => ID)
  id: string;
}
