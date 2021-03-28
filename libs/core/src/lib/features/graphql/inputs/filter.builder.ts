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
 * File name:         filter.builder.ts
 * Last modified:     22/03/2021, 18:22
 ******************************************************************************/

import { ClassType } from '@ultimate-backend/common';
import { Field, InputType } from '@nestjs/graphql';
import {
  BooleanComparisonFilter,
  DateComparisonFilter,
  enumComparisonFilterBuilder,
  NumberComparisonFilter,
  StringComparisonFilter,
} from './filter-types.input';
import {
  FilterableFieldMetadata,
  getCoreMetadataStorage,
} from '../../../metadata-store';
import { FilterInputOption } from '@ultimate-backend/core';

function buildField(filter, prototype, value: FilterableFieldMetadata) {
  Field(() => filter, { nullable: true, ...(value?.options?.field || {}) })(
    prototype,
    value.name
  );
}

export function buildFilter<TItem>(
  TItemClass: ClassType<Partial<TItem>>,
  option?: FilterInputOption
): any {
  const classInputName = `Filter${TItemClass.name}Input`;

  // return cached instance if found
  const cachedInstance = getCoreMetadataStorage().generatedFilters.get(
    classInputName
  );
  if (cachedInstance) {
    return cachedInstance.target;
  }

  @InputType(classInputName)
  abstract class FilterInputClass {
    [key: string]: any;

    @Field(() => [FilterInputClass], { nullable: true })
    _OR?: FilterInputClass[];

    @Field(() => [FilterInputClass], { nullable: true })
    _AND?: FilterInputClass[];

    @Field(() => [FilterInputClass], { nullable: true })
    _NOR?: FilterInputClass[];
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
        (value) => value.objectType === superClass.constructor.name
      );

      parentFields.map((value) => {
        switch (value.schemaName) {
          case Boolean.name:
            buildField(BooleanComparisonFilter, classTarget.prototype, value);
            break;
          case String.name:
            if (value?.options?.isEnum) {
              buildField(
                enumComparisonFilterBuilder(value.filterType),
                classTarget.prototype,
                value
              );
            } else {
              buildField(StringComparisonFilter, classTarget.prototype, value);
            }
            break;
          case Number.name:
            if (value?.options?.isEnum) {
              buildField(
                enumComparisonFilterBuilder(value.filterType),
                classTarget.prototype,
                value
              );
            } else {
              buildField(NumberComparisonFilter, classTarget.prototype, value);
            }
            break;
          case Date.name:
            buildField(DateComparisonFilter, classTarget.prototype, value);
            break;
        }
      });
    }

    fields.map((value) => {
      switch (value.schemaName) {
        case Boolean.name:
          buildField(BooleanComparisonFilter, classTarget.prototype, value);
          break;
        case String.name:
          if (value?.options?.isEnum) {
            buildField(
              enumComparisonFilterBuilder(value.filterType),
              classTarget.prototype,
              value
            );
          } else {
            buildField(StringComparisonFilter, classTarget.prototype, value);
          }
          break;
        case Number.name:
          if (value?.options?.isEnum) {
            buildField(
              enumComparisonFilterBuilder(value.filterType),
              classTarget.prototype,
              value
            );
          } else {
            buildField(NumberComparisonFilter, classTarget.prototype, value);
          }
          break;
        case Date.name:
          buildField(DateComparisonFilter, classTarget.prototype, value);
          break;
        default:
          if (value.schemaName !== 'Object' && !option.skipNestedTypes) {
            const inst = getCoreMetadataStorage().filterableGraphqlSchema.get(
              value.schemaName
            );
            if (inst) {
              const BuiltClass = buildFilter(inst.target as any, option);
              buildField(BuiltClass, classTarget.prototype, value);
            }
          }
          break;
      }
    });
  };

  const target = new TItemClass();

  const SuperClass = Object.getPrototypeOf(target);
  recursiveBuilder(target, FilterInputClass, SuperClass);

  // store input field for later use
  getCoreMetadataStorage().collectGeneratedFiltersMetadata({
    name: classInputName,
    target: FilterInputClass,
  });

  return FilterInputClass;
}
