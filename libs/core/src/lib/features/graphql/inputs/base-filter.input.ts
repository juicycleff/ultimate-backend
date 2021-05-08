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
 * File name:         base-filter.input.ts
 * Last modified:     21/03/2021, 19:18
 ******************************************************************************/
import { ClassType } from '@ultimate-backend/common';
import { buildFilter } from './filter.builder';
import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationInput } from './pagination.input';

export interface FilterInputOption {
  simple?: boolean;
  skipNestedTypes?: boolean;
}

export function GenericFilterInput<TItem>(
  TItemClass: ClassType<Partial<TItem>>,
  option?: FilterInputOption
): any {
  const FilterInputClass = buildFilter<TItem>(TItemClass, option);

  if (option && option.simple) {
    return FilterInputClass;
  }

  @ArgsType()
  abstract class WherePaginatedFilter {
    @Field(() => FilterInputClass, { nullable: true })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    where?: FilterInputClass;

    @Field(() => PaginationInput, { nullable: true })
    paginate?: PaginationInput;
  }

  return WherePaginatedFilter;
}
