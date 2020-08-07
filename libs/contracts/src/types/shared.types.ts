import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Filterable } from '@ultimatebackend/core/decorators/filterable';

@ObjectType()
export class BooleanPayload {
  @Filterable()
  @Field()
  success: boolean;
}

@ObjectType()
export class Price {
  @Filterable()
  @Field({ nullable: true })
  amount: number;

  @Filterable()
  @Field({ nullable: true })
  currency: string;

  @Filterable()
  @Field(() => Int, { nullable: true })
  trialDays: number;

  @Filterable()
  @Field({ nullable: true })
  name: string;

  @Filterable()
  @Field({ nullable: true })
  id: string;
}

@ObjectType()
export class KeyValuePair {
  @Filterable()
  @Field()
  key: string;

  @Filterable()
  @Field({ nullable: true })
  value?: string;
}

@ObjectType()
export class Feature {
  @Field()
  name: string;

  @Field({ nullable: true })
  normalizedName?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  unit?: string;

  @Field(() => Int, { nullable: true })
  min?: number;

  @Field(() => Int, { nullable: true })
  max?: number;

  @Field({ nullable: true })
  active?: boolean;

  @Field({ nullable: true })
  full?: boolean;
}
