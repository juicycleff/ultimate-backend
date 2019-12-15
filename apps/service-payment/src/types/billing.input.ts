/* tslint:disable:max-classes-per-file */
import { ArgsType, Field, GraphQLISODateTime, ID, InputType, Int } from 'type-graphql';
import { Card, FilterMongo } from '@ultimatebackend/contracts';
import { Billing } from './billing.type';

@InputType()
export class CreateUpdateOfferInput {

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Int, { nullable: true })
  discountPercentage: number;

  @Field(() => Int, { nullable: true })
  discountMonths: number;

  @Field({ nullable: true })
  discountAmount: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate: Date | string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate: Date | string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  discountEndDate: Date | string;

  @Field(() => [ID], { nullable: true })
  plans: Date | string;
}

@InputType()
export class UpdateOfferInput {
  @Field(() => ID)
  id: string;

  @Field(() => CreateUpdateOfferInput)
  data: CreateUpdateOfferInput;
}

@InputType()
export class DeleteOfferInput {
  @Field(() => ID)
  id: string;
}

@ArgsType()
export class BillingMutationInput {

  @Field(() => CreateUpdateOfferInput, { nullable: true })
  create: CreateUpdateOfferInput;

  @Field(() => UpdateOfferInput, { nullable: true })
  update: UpdateOfferInput;

  @Field(() => DeleteOfferInput, { nullable: true })
  delete: DeleteOfferInput;
}

@InputType()
export class BillingMutationTypes {

  @Field(() => Card, { nullable: true })
  card?: Card;
}

@InputType()
export class BillingFilterInput extends FilterMongo(Billing, { simple: true }) {}
