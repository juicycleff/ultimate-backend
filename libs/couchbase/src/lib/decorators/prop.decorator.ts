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
 * File name:         prop.decorator.ts
 * Last modified:     20/01/2021, 11:17
 ******************************************************************************/

import { TypeMetadataStorage } from '../storages';
import { SchemaTypeOptions } from '../interfaces';
import { CannotDetermineTypeError } from '../errors';

const TYPE_METADATA_KEY = 'design:type';

/**
 * Interface defining property options that can be passed to `@Prop()` decorator.
 */
export type PropOptions = SchemaTypeOptions<any>;

/**
 * @Prop decorator is used to mark a specific class property as a Mongoose property.
 * Only properties decorated with this decorator will be defined in the schema.
 */
export function Property(options?: PropOptions): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: object, propertyKey: string | symbol) => {
    options = (options || {}) as SchemaTypeOptions<unknown>;

    if (!options.type && !Array.isArray(options)) {
      const type = Reflect.getMetadata(TYPE_METADATA_KEY, target, propertyKey);

      if (type === Array) {
        options.type = [];
      } else if (type && type !== Object) {
        options.type = type;
      } else {
        throw new CannotDetermineTypeError(
          target.constructor?.name,
          propertyKey as string
        );
      }
    }

    TypeMetadataStorage.addPropertyMetadata({
      target: target.constructor,
      propertyKey: propertyKey as string,
      options: options as PropOptions,
    });
  };
}
