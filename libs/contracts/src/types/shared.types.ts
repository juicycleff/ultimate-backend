/* tslint:disable:max-classes-per-file */
import { Field, ObjectType, Int } from 'type-graphql';
import { Filterable } from '@graphqlcqrs/core/decorators/filterable';

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
  price: number;

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

  @Filterable()
  @Field()
  name: string;

  @Filterable()
  @Field({ nullable: true })
  normalizedName?: string;

  @Filterable()
  @Field({ nullable: true })
  description?: string;

  @Filterable()
  @Field(() => Int, { nullable: true })
  min?: number;

  @Filterable()
  @Field(() => Int, { nullable: true })
  max?: number;

  @Filterable()
  @Field({ nullable: true })
  active?: boolean;

  @Filterable()
  @Field({ nullable: true })
  full?: boolean;
}
