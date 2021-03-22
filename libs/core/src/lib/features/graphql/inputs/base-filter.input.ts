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
import { ArgsType, Field, InputType } from '@nestjs/graphql';
import * as _ from 'lodash';
import {
  BooleanComparisonFilter,
  DateComparisonFilter,
  EnumComparisonFilter,
  NumberComparisonFilter,
  StringComparisonFilter,
} from './filter-types.input';
import { PaginationInput } from './pagination.input';
import { getCoreMetadataStorage } from '../../../metadata-store';

interface FilterInputOption {
  simple?: boolean;
}

export function FilterMongoSchemaType<TItem>(
  TItemClass: ClassType<Partial<TItem>>,
  option?: FilterInputOption
): any {
  @InputType(`Filter${TItemClass.name}Input`)
  abstract class FilterMongoClass {
    [key: string]: any;

    @Field(() => [FilterMongoClass], { nullable: true })
    _OR?: FilterMongoClass[];

    @Field(() => [FilterMongoClass], { nullable: true })
    _AND?: FilterMongoClass[];

    @Field(() => [FilterMongoClass], { nullable: true })
    _NOR?: FilterMongoClass[];
  }

  const recursiveBuilder = (
    temp: any,
    classTarget: any,
    superClass: any = null
  ) => {
    const fields = getCoreMetadataStorage().filterableGraphqlFields.filter(
      (value) => value.objectType === temp.constructor.name
    );

    if (superClass) {
      const parentFields = getCoreMetadataStorage().filterableGraphqlFields.filter(
        (value) => value.objectType === superClass.prototype.constructor.name
      );

      parentFields.map((value) => {
        if (value.getType() === Boolean) {
          Field(() => BooleanComparisonFilter, { nullable: true })(
            classTarget.prototype,
            value.name
          );
        } else if (value.getType() === String) {
          Field(() => StringComparisonFilter, { nullable: true })(
            classTarget.prototype,
            value.name
          );
        } else if (value.getType() === Number) {
          Field(() => NumberComparisonFilter, { nullable: true })(
            classTarget.prototype,
            value.name
          );
        } else if (value.getType() === Date) {
          Field(() => DateComparisonFilter, { nullable: true })(
            classTarget.prototype,
            value.name
          );
        } else if (value.getType() === Object) {
          // Field(() => EnumComparisonFilterFunc<classTarget>(value.returnTypeFunc), { nullable: true })(classTarget.prototype, value.name);
        } else {
          if (value.getType() === Array) {
            if (
              typeof value.fieldType !== 'string' &&
              Object.getPrototypeOf(value.fieldType?.prototype).constructor
                .name === 'FilterMongoClass'
            ) {
              Field(() => value.fieldType, { nullable: true })(
                classTarget.prototype,
                value.name
              );
            }
            // recursiveBuilder(value.fieldType, classTarget);
            // const TypeClass = InstanceLoader.getInstance(this, `${value.fieldType.prototype.constructor.name}InputFilter`);
            // Field(() => TypeClass, { nullable: true })(classTarget.prototype, value.name);
            // recursiveBuilder(value.fieldType, classTarget);
          }
        }
      });
    }

    fields.map((value) => {
      if (value.getType() === Boolean) {
        Field(() => BooleanComparisonFilter, { nullable: true })(
          classTarget.prototype,
          value.name
        );
      } else if (value.getType() === String) {
        Field(() => StringComparisonFilter, { nullable: true })(
          classTarget.prototype,
          value.name
        );
      } else if (value.getType() === Number) {
        Field(() => NumberComparisonFilter, { nullable: true })(
          classTarget.prototype,
          value.name
        );
      } else if (value.getType() === Date) {
        Field(() => DateComparisonFilter, { nullable: true })(
          classTarget.prototype,
          value.name
        );
      } else if (value.getType().constructor.name === 'Object') {
        if (value.typeOptions.isEnum) {
          Field(() => EnumComparisonFilter, { nullable: true })(
            classTarget.prototype,
            value.name,
            typeof value.name
          );
        }
      } else {
        if (value.getType() === Array) {
          if (
            typeof value.fieldType !== 'string' &&
            Object.getPrototypeOf(value.fieldType?.prototype).constructor
              .name === 'FilterMongoClass'
          ) {
            Field(() => value.fieldType, { nullable: true })(
              classTarget.prototype,
              value.name
            );
          }
          // recursiveBuilder(value.fieldType, classTarget);
        }
      }
    });
  };

  const target = new TItemClass();
  const SuperClass = Object.getPrototypeOf(Object.getPrototypeOf(target))
    .constructor;
  recursiveBuilder(target, FilterMongoClass, SuperClass);

  if (option && option.simple) {
    return FilterMongoClass;
  }

  @ArgsType()
  abstract class WherePaginatedFilter {
    @Field(() => FilterMongoClass, { nullable: true })
    where?: FilterMongoClass;

    @Field(() => PaginationInput, { nullable: true })
    paginate?: PaginationInput;
  }

  return WherePaginatedFilter;
}
