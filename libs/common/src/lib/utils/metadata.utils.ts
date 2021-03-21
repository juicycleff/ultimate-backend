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
 * File name:         metadata.utils.ts
 * Last modified:     14/03/2021, 20:21
 ******************************************************************************/

import 'reflect-metadata';

export const ExtendMetadata = <K = any, V = any>(
  metadataKey: K,
  metadataValue: V
) => (target: object, key?: any, descriptor?: any) => {
  if (descriptor) {
    const previousValue =
      Reflect.getMetadata(metadataKey, descriptor.value) || [];
    const value = [...previousValue, metadataValue];
    Reflect.defineMetadata(metadataKey, value, descriptor.value);
    return descriptor;
  }

  const previousValue = Reflect.getMetadata(metadataKey, target) || [];
  const value = [...previousValue, metadataValue];
  Reflect.defineMetadata(metadataKey, value, target);
  return target;
};

export const AssignMetadata = <K = any, V = any>(
  metadataKey: K,
  metadataValue: V
) => (target: object, key?: any, descriptor?: any) => {
  if (descriptor) {
    const previousValue =
      Reflect.getMetadata(metadataKey, descriptor.value) || {};
    const value = Object.assign({}, previousValue, metadataValue);
    Reflect.defineMetadata(metadataKey, value, descriptor.value);
    return descriptor;
  }

  const previousValue = Reflect.getMetadata(metadataKey, target) || {};
  const value = Object.assign({}, previousValue, metadataValue);
  Reflect.defineMetadata(metadataKey, value, target);
  return target;
};

export const ExtendArrayMetadata = <K = any, V = any>(
  metadataKey: K,
  metadataValues: Array<V>
) => (target: object, key?: any, descriptor?: any) => {
  if (descriptor) {
    const previousValue =
      Reflect.getMetadata(metadataKey, descriptor.value) || [];
    const value = [...previousValue, ...metadataValues];
    Reflect.defineMetadata(metadataKey, value, descriptor.value);
    return descriptor;
  }

  const previousValue = Reflect.getMetadata(metadataKey, target) || [];
  const value = [...previousValue, ...metadataValues];
  Reflect.defineMetadata(metadataKey, value, target);
  return target;
};

export class ReflectMetadataMissingError extends Error {
  constructor() {
    super(
      "Looks like you've forgot to provide experimental metadata API polyfill. " +
      'Please read the installation instruction for more details.',
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function ensureReflectMetadataExists() {
  if (
    typeof Reflect !== 'object' ||
    typeof Reflect.decorate !== 'function' ||
    typeof Reflect.metadata !== 'function'
  ) {
    throw new ReflectMetadataMissingError();
  }
}
