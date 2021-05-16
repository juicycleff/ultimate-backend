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
 * File name:         type-metadata.storage.ts
 * Last modified:     20/01/2021, 11:17
 ******************************************************************************/

import { Type } from '@nestjs/common';
import { SchemaMetadata, PropertyMetadata } from '../metadata';
import { isTargetEqual } from '../utils';

export class TypeMetadataStorageHost {
  private schemas = new Array<SchemaMetadata>();
  private properties = new Array<PropertyMetadata>();

  addPropertyMetadata(metadata: PropertyMetadata) {
    this.properties.push(metadata);
  }

  addSchemaMetadata(metadata: SchemaMetadata) {
    this.compileClassMetadata(metadata);
    this.schemas.push(metadata);
  }

  getSchemaMetadataByTarget(target: Type<unknown>): SchemaMetadata | undefined {
    return this.schemas.find((item) => item.target === target);
  }

  private compileClassMetadata(metadata: SchemaMetadata) {
    const belongsToClass = isTargetEqual.bind(undefined, metadata);

    if (!metadata.properties) {
      metadata.properties = this.getClassFieldsByPredicate(belongsToClass);
    }
  }

  private getClassFieldsByPredicate(
    belongsToClass: (item: PropertyMetadata) => boolean
  ) {
    return this.properties.filter(belongsToClass);
  }
}

const globalRef = global as any;
export const TypeMetadataStorage: TypeMetadataStorageHost =
  globalRef.MongoTypeMetadataStorage ||
  (globalRef.MongoTypeMetadataStorage = new TypeMetadataStorageHost());
