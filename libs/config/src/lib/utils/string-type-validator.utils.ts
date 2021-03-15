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
 * File name:         string-type-validator.utils.ts
 * Last modified:     07/02/2021, 12:41
 ******************************************************************************/

import * as YAML from 'yaml';
import * as TOML from '@iarna/toml';
import { TomlError } from '@iarna/toml/lib/toml-parser.js';

export enum StringFormatType {
  json = 'json',
  yaml = 'yaml',
  toml = 'toml',
}

/**
 * Check if string is a valid YAML
 * @param rawString {String}
 */
export function isValidYaml(rawString: string): boolean {
  try {
    if (YAML.parse(rawString) && !TOML.parse(rawString)) {
      return true;
    }

    return false;
  } catch (e) {
    if (e instanceof TomlError) {
      return true;
    }
    return false;
  }
}

/**
 * Check if string is a valid JSON
 * @param rawString {String}
 */
export function isValidJson(rawString: string): boolean {
  try {
    JSON.parse(rawString);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Check if string is a valid TOML
 * @param rawString {String}
 */
export function isValidToml(rawString: string): boolean {
  try {
    TOML.parse(rawString);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Check if string is a valid TOML
 * @param rawString
 */
export function validateAndGetStringType(rawString: string): StringFormatType {
  if (isValidJson(rawString)) {
    return StringFormatType.json;
  } else if (isValidYaml(rawString)) {
    return StringFormatType.yaml;
  } else if (isValidToml(rawString)) {
    return StringFormatType.toml;
  }

  throw new Error('Invalid config format (only supports json, yaml and toml)');
}

/**
 * Convert string to object type
 * @param rawString
 */
export function stringToObjectType(rawString: string): any {
  if (isValidJson(rawString)) {
    return JSON.parse(rawString);
  } else if (isValidYaml(rawString)) {
    return YAML.parse(rawString);
  } else if (isValidToml(rawString)) {
    return TOML.parse(rawString);
  }

  throw new Error('Invalid config format (only supports json, yaml and toml)');
}

/**
 * Convert object to string
 * @param rawString
 * @param object
 */
export function objectToStringFormat(rawString: string, object: any): string {
  if (isValidJson(rawString)) {
    return JSON.stringify(object);
  } else if (isValidYaml(rawString)) {
    return YAML.stringify(object);
  } else if (isValidToml(rawString)) {
    return TOML.stringify(object);
  }

  throw new Error('Invalid config format (only supports json, yaml and toml)');
}
