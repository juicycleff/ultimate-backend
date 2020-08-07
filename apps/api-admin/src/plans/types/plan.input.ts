import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import { FeatureInput, PriceInput } from '@ultimatebackend/contracts';

@InputType()
export class CreateUpdatePlanInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [PriceInput])
  prices: [PriceInput];

  @Field(() => [FeatureInput], { nullable: true })
  features: FeatureInput[];

  @Field({ nullable: true })
  free: boolean;

  @Field()
  active: boolean;
}

@InputType()
export class UpdatePlanInput {
  @Field(() => ID)
  id: string;

  @Field(() => CreateUpdatePlanInput)
  data: CreateUpdatePlanInput;
}

@InputType()
export class DeletePlanInput {
  @Field(() => ID)
  id: string;
}

@ArgsType()
export class PlanMutationInput {
  @Field(() => CreateUpdatePlanInput, { nullable: true })
  create: CreateUpdatePlanInput;

  @Field(() => UpdatePlanInput, { nullable: true })
  update: UpdatePlanInput;

  @Field(() => DeletePlanInput, { nullable: true })
  delete: DeletePlanInput;
}

@InputType()
export class PlanFilterInput {
  @Field({ nullable: true })
  shippable: boolean;

  @Field(() => [String], { nullable: true })
  ids: string[];

  @Field({ nullable: true })
  active: boolean;
}
