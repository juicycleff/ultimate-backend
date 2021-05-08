/* eslint-disabled */
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
 * File name:         filterable.decorator.ts
 * Last modified:     22/03/2021, 16:02
 ******************************************************************************/
import { FieldOptions, ReturnTypeFunc } from '@nestjs/graphql';
import { isFunction } from 'lodash';
import { getCoreMetadataStorage } from '../../../metadata-store';
import { ClassType } from '@ultimate-backend/common';
import { findType } from '../utils';
import { isPlainObject } from '@nestjs/common/utils/shared.utils';

export function FilterableField(
  typeOrOptions?: ReturnTypeFunc | FilterableOption,
  filterOption?: FilterableOption
): PropertyDecorator & MethodDecorator {
  return function (prototype, propertyKey: string) {
    // eslint-disable-next-line prefer-const
    let [typeFunc, options] = isFunction(typeOrOptions)
      ? [typeOrOptions as ReturnTypeFunc, filterOption as FilterableOption]
      : [undefined, typeOrOptions as FilterableOption];

    const { getType } = findType({
      metadataKey: 'design:type',
      prototype,
      propertyKey,
      returnTypeFunc: typeFunc as ReturnTypeFunc,
      typeOptions: options,
    });

    let fieldSchemaType;
    let schemaName;
    if (isFunction(typeFunc)) {
      const tempFieldType = typeFunc() as any;
      if (isPlainObject(tempFieldType)) {
        fieldSchemaType = tempFieldType;
      } else {
        fieldSchemaType = tempFieldType.prototype?.constructor;
      }

      const fieldType = getType() as any;
      if (fieldType.prototype?.constructor?.name !== 'Array') {
        schemaName = fieldType.prototype?.constructor?.name;
      }
    } else if (isFunction(getType)) {
      const fieldType = getType() as any;
      if (fieldType) {
        schemaName = fieldType.prototype?.constructor?.name;
        if (fieldType.prototype?.constructor?.name !== 'Array') {
          fieldSchemaType = fieldType.prototype?.constructor;
        }
      }
    }

    getCoreMetadataStorage().collectFilterableGraphqlSchemaMetadata({
      name: schemaName,
      target: fieldSchemaType,
    });

    const filterType = options?.type ?? fieldSchemaType;

    if (isPlainObject(filterType)) {
      options = {
        ...options,
        isEnum: true,
      };
    }

    getCoreMetadataStorage().collectFilterableGraphqlFieldsMetadata({
      name: propertyKey,
      getType,
      typeOptions: null,
      fieldType: options?.type ?? fieldSchemaType,
      target: prototype.constructor,
      objectType: prototype.constructor.name,
      methodName: propertyKey,

      filterType,
      typeFn: getType,
      fieldName: propertyKey,
      parentType: prototype.constructor,
      schemaName,
      options,
    });
  };
}

interface FilterableOption {
  type?: ClassType | any;
  isEnum?: boolean;
  field?: FieldOptions;
}
