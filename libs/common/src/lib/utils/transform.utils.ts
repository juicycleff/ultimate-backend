/* eslint-disable no-prototype-builtins */
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
 * File name:         transform.find-type.utils.ts
 * Last modified:     14/03/2021, 23:22
 ******************************************************************************/

import * as _ from 'lodash';

export const objectToMap = (object) => {
  const result = {};
  parseObjectToMap(result, object);

  return result;
};

export const mapToObject = (map) => {
  const result = {};
  for (const key in map) {
    if (!map.hasOwnProperty(key)) {
      continue;
    }

    _.set(result, key, map[key]);
  }

  return result;
};

export const stringToKeyValue = (
  values: string[],
  char = '='
): Map<string, string> => {
  const map = new Map<string, string>();
  values.forEach((value) => {
    value = value.trim();
    const chunks = value.split(char);
    map.set(chunks[0], chunks[1]);
  });
  return map;
};

function parseObjectToMap(mapper, object, path?) {
  if (!mapper) {
    mapper = {};
  }

  for (const key in object) {
    if (!object.hasOwnProperty(key)) {
      continue;
    }
    let newPath;
    if (!path) {
      newPath = key;
    } else {
      newPath = path + '.' + key;
    }

    if (!object.hasOwnProperty(key)) {
      continue;
    }

    if (_.isArray(object[key])) {
      mapper[newPath] = object[key];
      parseArray(mapper, object[key], newPath);
    } else if (_.isObject(object[key])) {
      mapper[newPath] = object[key];
      parseObjectToMap(mapper, object[key], newPath);
    } else {
      mapper[newPath] = object[key];
    }
  }
}

function parseArray(mapper, array, path) {
  array.forEach((item, index) => {
    const newPath = path + '[' + index + ']';
    if (_.isObject(item)) {
      parseObjectToMap(mapper, item, newPath);
    } else if (_.isArray(item)) {
      parseArray(mapper, item, newPath);
    } else {
      mapper[newPath] = item;
    }
  });
}
