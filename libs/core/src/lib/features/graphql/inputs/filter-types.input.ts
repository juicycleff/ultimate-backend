/*******************************************************************************
 * Copyright (c) 2021. Rex Isaac Raphael
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * File name:         filter-types.input.ts
 * Last modified:     21/03/2021, 19:46
 ******************************************************************************/

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
