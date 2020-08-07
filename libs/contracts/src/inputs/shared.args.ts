import { Int, ArgsType, Field, InputType } from '@nestjs/graphql';
import { PlanPriceInterval } from '@ultimatebackend/contracts';

@InputType()
export class PaginationInput {
  @Field(() => Int)
  skip: number = 0;

  @Field(() => Int)
  limit: number = 10;
}

@InputType()
export class ConnectionPaginationInput {
  @Field(() => Int, { nullable: true })
  first?: number = 0;

  @Field(() => Int, { nullable: true })
  last?: number = 10;

  @Field({ nullable: true })
  after?: string;

  @Field({ nullable: true })
  before?: string;
}

@ArgsType()
export class PaginationArgs {
  @Field(() => PaginationInput)
  paginate?: PaginationInput;
}

@InputType()
export class PriceInput {
  @Field()
  price: number;

  @Field()
  currency: string;

  @Field({ nullable: true })
  id?: string;

  @Field()
  nickname: string;

  @Field(() => Int, { nullable: true })
  trialDays?: number;

  @Field(() => Int, {
    nullable: true,
    description:
      'The interval cunt for the field interval, eg. for interval MONTH, you can pass 3',
  })
  intervalCount?: number;

  @Field(() => PlanPriceInterval)
  interval: PlanPriceInterval;
}

@InputType()
export class KeyValuePairInput {
  @Field()
  key: string;

  @Field({ nullable: true })
  value?: string;
}

@InputType()
export class FeatureInput {
  @Field()
  name: string;

  @Field()
  normalizedName!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  min?: number;

  @Field(() => Int, { nullable: true })
  max?: number;

  @Field()
  active: boolean;

  @Field()
  full: boolean;
}
