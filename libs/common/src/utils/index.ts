import { isEmpty, isPlainObject, transform } from 'lodash';

export * from './encryption.util';
export * from './hash.utils';
export * from './key.shared.utils';
export * from './dto-mapper.utils';
export * from './app.utils';
export * from './crypto.utils';
export * from './mime-type.util';
export * from './cors-config.util';
export * from './magic-code.generator';
export * from './metadata.utils';

export function reduceByPercent(numb: number, value: number): number {
  const per = 100 - value;
  return (numb * per) / 100;
}

export function cleanEmptyProperties(
  obj: any,
  {
    cleanKeys = [],
    cleanValues = [],
    emptyArrays = true,
    emptyObjects = true,
    emptyStrings = true,
    nullValues = true,
    undefinedValues = true,
  } = {},
): any {
  return transform(obj, (result, value, key) => {
    // Exclude specific keys.
    if (cleanKeys.includes(key)) {
      return;
    }

    // Recurse into arrays and objects.
    if (Array.isArray(value) || isPlainObject(value)) {
      value = cleanEmptyProperties(value, {
        cleanKeys,
        cleanValues,
        emptyArrays,
        emptyObjects,
        emptyStrings,
        nullValues,
        undefinedValues,
      });
    }

    // Exclude specific values.
    if (cleanValues.includes(value)) {
      return;
    }

    // Exclude empty objects.
    if (emptyObjects && isPlainObject(value) && isEmpty(value)) {
      return;
    }

    // Exclude empty arrays.
    if (emptyArrays && Array.isArray(value) && !value.length) {
      return;
    }

    // Exclude empty strings.
    if (emptyStrings && value === '') {
      return;
    }

    // Exclude null values.
    if (nullValues && value === null) {
      return;
    }

    // Exclude undefined values.
    if (undefinedValues && value === undefined) {
      return;
    }

    // Append when recursing arrays.
    if (Array.isArray(result)) {
      return result.push(value);
    }

    result[key] = value;
  });
}
