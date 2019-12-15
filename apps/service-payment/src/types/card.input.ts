/* tslint:disable:max-classes-per-file */
import { ArgsType, Field, ID, InputType } from 'type-graphql';
import { CardInput } from '@ultimatebackend/contracts';

@InputType()
export class CreateUpdateCardInput  extends CardInput {}

@InputType()
export class UpdateCardInput {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  data: CreateUpdateCardInput;
}

@InputType()
export class DeleteCardInput {
  @Field(() => ID)
  id: string;
}

@ArgsType()
export class CardMutationInput {

  @Field(() => CreateUpdateCardInput, { nullable: true })
  create: CreateUpdateCardInput;

  @Field(() => UpdateCardInput, { nullable: true })
  update: UpdateCardInput;

  @Field(() => DeleteCardInput, { nullable: true })
  delete: DeleteCardInput;
}
