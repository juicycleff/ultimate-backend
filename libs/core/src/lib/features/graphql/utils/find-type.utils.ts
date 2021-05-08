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
 * File name:         find-type.utils.ts
 * Last modified:     22/03/2021, 16:09
 ******************************************************************************/
import { TypeValueThunk } from '@ultimate-backend/common';
import { ReturnTypeFunc } from '@nestjs/graphql';
import { FilterTypeOptions } from '../../../metadata-store';

export type MetadataKey =
  | 'design:type'
  | 'design:paramtypes'
  | 'design:returntype';
export const allowedTypes: Function[] = [String, Number, Date, Boolean];
export const bannedTypes: Function[] = [Promise, Array, Object, Function];

export interface TypeInfo {
  getType: TypeValueThunk;
  typeOptions: FilterTypeOptions;
}

export interface GetTypeParams {
  metadataKey: MetadataKey;
  prototype: Object;
  propertyKey: string;
  typeOptions?: FilterTypeOptions;
  returnTypeFunc?: ReturnTypeFunc;
  parameterIndex?: number;
}
export function findType({
  metadataKey,
  prototype,
  propertyKey,
  typeOptions = {},
  parameterIndex,
  returnTypeFunc,
}: GetTypeParams): TypeInfo {
  const options: FilterTypeOptions = { ...typeOptions };
  let metadataDesignType: Function | undefined;

  const reflectedType: Function[] | Function | undefined = Reflect.getMetadata(
    metadataKey,
    prototype,
    propertyKey
  );

  if (metadataKey === 'design:paramtypes') {
    metadataDesignType = (reflectedType as Function[])[parameterIndex!];
  } else {
    metadataDesignType = reflectedType as Function | undefined;
  }

  if (
    !returnTypeFunc &&
    (!metadataDesignType ||
      (metadataDesignType && bannedTypes.includes(metadataDesignType)))
  ) {
    // throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
  }

  if (metadataDesignType) {
    return {
      getType: () => metadataDesignType!,
      typeOptions: options,
    };
  } else {
    throw new CannotDetermineTypeError(
      prototype.constructor.name,
      propertyKey,
      parameterIndex
    );
  }
}

export class CannotDetermineTypeError extends Error {
  constructor(typeName: string, propertyKey: string, parameterIndex?: number) {
    let errorMessage = `Cannot determine type for ${typeName}#${propertyKey} `;
    if (parameterIndex !== undefined) {
      errorMessage += `parameter #${parameterIndex} `;
    }
    errorMessage += '!';
    super(errorMessage);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
