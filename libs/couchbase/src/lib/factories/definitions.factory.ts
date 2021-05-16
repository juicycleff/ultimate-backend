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
 * File name:         definitions.factory.ts
 * Last modified:     20/01/2021, 11:17
 ******************************************************************************/

import { Type } from '@nestjs/common';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import * as ottoman from 'ottoman';
import { TypeMetadataStorage } from '../storages';
import {
  SchemaDef,
  SchemaOptions,
} from 'ottoman/lib/types/schema/interfaces/schema.types';

export class DefinitionsFactory {
  static createForClass(
    target: Type<unknown>,
    options: SchemaOptions
  ): SchemaDef | ottoman.Schema {
    if (!target) {
      throw new Error(
        `Target class "${target}" passed in to the "DefinitionsFactory#createForClass()" method is "undefined".`
      );
    }
    let schemaDefinition: SchemaDef = {};
    // eslint-disable-next-line @typescript-eslint/ban-types
    let parent: Function = target;

    while (!isUndefined(parent.prototype)) {
      if (parent === Function.prototype) {
        break;
      }
      const schemaMetadata = TypeMetadataStorage.getSchemaMetadataByTarget(
        parent as Type<unknown>
      );
      if (!schemaMetadata) {
        parent = Object.getPrototypeOf(parent);
        continue;
      }
      schemaMetadata.properties?.forEach((item) => {
        const _options = item.options as any;

        schemaDefinition = {
          [item.propertyKey]: _options,
          ...schemaDefinition,
        };
      });
      parent = Object.getPrototypeOf(parent);
    }

    return new ottoman.Schema(schemaDefinition, options);
  }
}
