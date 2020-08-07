/* tslint:disable:max-classes-per-file */
import { Field, InputType, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class OtherComparisonFilter {
  @Field({ nullable: true })
  _EQ?: string;

  @Field({ nullable: true })
  _NE?: string;

  @Field({ nullable: true })
  _LT?: string;

  @Field({ nullable: true })
  _LTE?: string;

  @Field({ nullable: true })
  _GT?: string;

  @Field({ nullable: true })
  _GTE?: string;
}

@InputType()
export class StringComparisonFilter {
  @Field({ nullable: true })
  _EQ?: string;

  @Field({ nullable: true })
  _NE?: string;

  @Field({ nullable: true })
  _LT?: string;

  @Field({ nullable: true })
  _LTE?: string;

  @Field({ nullable: true })
  _GT?: string;

  @Field({ nullable: true })
  _GTE?: string;
}

@InputType()
export class EnumComparisonFilter<T> {
  @Field({ nullable: true })
  _EQ?: string;

  @Field({ nullable: true })
  _NE?: string;
}

@InputType()
export class DateComparisonFilter {
  @Field(() => GraphQLISODateTime, { nullable: true })
  _EQ?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  _NE?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  _LT?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  _LTE?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  _GT?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  _GTE?: string;
}

@InputType()
export class ArrayComparisonFilter {
  @Field({ nullable: true })
  _ALL?: string;

  @Field({ nullable: true })
  _IN?: string;

  @Field({ nullable: true })
  _NIN?: string;
}

@InputType()
export class NumberComparisonFilter {
  @Field({ nullable: true })
  _EQ?: number;

  @Field({ nullable: true })
  _NE?: number;

  @Field({ nullable: true })
  _LT?: number;

  @Field({ nullable: true })
  _LTE?: number;

  @Field({ nullable: true })
  _GT?: number;

  @Field({ nullable: true })
  _GTE?: number;
}

@InputType()
export class BooleanComparisonFilter {
  @Field({ nullable: true })
  _EQ?: boolean;

  @Field({ nullable: true })
  _NE?: boolean;
}
