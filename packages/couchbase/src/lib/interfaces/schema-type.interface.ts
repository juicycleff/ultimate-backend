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
 * File name:         schema-type.interface.ts
 * Last modified:     20/01/2021, 11:17
 ******************************************************************************/

import { Model } from 'ottoman';

export interface SchemaTypeOptions<T> {
  type?: T;

  /** Defines a virtual with the given name that gets/sets this path. */
  alias?: string;

  /** Function or object describing how to validate this schematype. See [validation docs](https://Ottomanjs.com/docs/validation.html). */
  // eslint-disable-next-line @typescript-eslint/ban-types
  validate?: RegExp | [RegExp, string] | Function | [Function, string];

  /** Allows overriding casting logic for this individual path. If a string, the given string overwrites Ottoman's default cast error message. */
  cast?: string;

  /**
   * If true, attach a required validator to this path, which ensures this path
   * path cannot be set to a nullish value. If a function, Ottoman calls the
   * function and only checks for nullish values if the function returns a truthy value.
   */
  required?: boolean | (() => boolean) | [boolean, string];

  /**
   * The default value for this path. If a function, Ottoman executes the function
   * and uses the return value as the default.
   */
  default?: T | ((this: any, doc: any) => T);

  /**
   * The model that `populate()` should use if populating this path.
   */
  ref?: string | Model<any> | ((this: any, doc: any) => string | Model<any>);

  /**
   * Whether to include or exclude this path by default when loading documents
   * using `find()`, `findOne()`, etc.
   */
  select?: boolean | number;

  /**
   * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Ottoman will
   * build an index on this path when the model is compiled.
   */
  index?: boolean | number;

  /**
   * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Ottoman
   * will build a unique index on this path when the
   * model is compiled. [The `unique` option is **not** a validator](/docs/validation.html#the-unique-option-is-not-a-validator).
   */
  unique?: boolean | number;

  /**
   * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Ottoman will
   * disallow changes to this path once the document is saved to the database for the first time. Read more
   * about [immutability in Ottoman here](http://thecodebarbarian.com/whats-new-in-Ottoman-5-6-immutable-properties.html).
   */
  immutable?: boolean | ((this: any, doc: any) => boolean);

  /**
   * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Ottoman will
   * build a sparse index on this path.
   */
  sparse?: boolean | number;

  /**
   * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Ottoman
   * will build a text index on this path.
   */
  text?: boolean | number | any;

  /**
   * Define a transform function for this individual schema type.
   * Only called when calling `toJSON()` or `toObject()`.
   */
  transform?: (this: any, val: T) => any;

  /** defines a custom getter for this property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). */
  get?: (value: T, schematype?: this) => any;

  /** defines a custom setter for this property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). */
  set?: (value: T, schematype?: this) => any;

  /** array of allowed values for this path. Allowed for strings, numbers, and arrays of strings */
  enum?: Array<string | number | null>;

  /** The default [subtype](http://bsonspec.org/spec.html) associated with this buffer when it is stored in MongoDB. Only allowed for buffer paths */
  subtype?: number;

  /** The minimum value allowed for this path. Only allowed for numbers and dates. */
  min?: number | Date | [number, string] | [Date, string];

  /** The maximum value allowed for this path. Only allowed for numbers and dates. */
  max?: number | Date | [number, string] | [Date, string];

  /** Defines a TTL index on this path. Only allowed for dates. */
  expires?: number | Date;

  /** If `true`, Ottoman will skip gathering indexes on subpaths. Only allowed for subdocuments and subdocument arrays. */
  excludeIndexes?: boolean;

  /** If set, overrides the child schema's `_id` option. Only allowed for subdocuments and subdocument arrays. */
  _id?: boolean;

  /** If set, specifies the type of this map's values. Ottoman will cast this map's values to the given type. */
  // eslint-disable-next-line @typescript-eslint/ban-types
  of?: Function | SchemaTypeOptions<any>;

  /** If true, uses Ottoman's default `_id` settings. Only allowed for ObjectIds */
  auto?: boolean;

  /** Attaches a validator that succeeds if the data string matches the given regular expression, and fails otherwise. */
  match?: RegExp;

  /** If truthy, Ottoman will add a custom setter that lowercases this string using JavaScript's built-in `String#toLowerCase()`. */
  lowercase?: boolean;

  /** If truthy, Ottoman will add a custom setter that removes leading and trailing whitespace using JavaScript's built-in `String#trim()`. */
  trim?: boolean;

  /** If truthy, Ottoman will add a custom setter that uppercases this string using JavaScript's built-in `String#toUpperCase()`. */
  uppercase?: boolean;

  /** If set, Ottoman will add a custom validator that ensures the given string's `length` is at least the given number. */
  minlength?: number | [number, string];

  /** If set, Ottoman will add a custom validator that ensures the given string's `length` is at most the given number. */
  maxlength?: number | [number, string];

  [other: string]: any;
}
