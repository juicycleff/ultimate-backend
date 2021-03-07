import * as moment from 'moment';

export type ArgType =
  | 'OPERATOR'
  | 'COMPUTED'
  | 'PRIMITIVE'
  | 'ARRAY'
  | 'NESTED'
  | 'FLAT'
  | 'DATE';

export type Resolver = (parent: any) => any;

export interface Resolvers {
  [key: string]: Resolver;
}

export interface Keywords {
  [key: string]: string;
}

export const primitives = [
  'string',
  'number',
  'boolean',
  'bigint',
  'undefined',
  'null',
  'symbol',
];

export const defaultKeywords: Keywords = {
  _OR: '$or',
  _AND: '$and',
  _NOR: '$nor',
  _ALL: '$all',
  _IN: '$in',
  _NIN: '$nin',
  _EQ: '$eq',
  _NE: '$ne',
  _LT: '$lt',
  _LTE: '$lte',
  _GT: '$gt',
  _GTE: '$gte',
  // geo queries operators:
  _GEO_INTERSECTS: '$geoIntersects',
  _GEO_WITHIN: '$geoWithin',
  _NEAR: '$near',
  _NEAR_SPHERE: '$nearSphere',
  // geo shapes operators:
  _GEOMETRY: '$geometry',
  _BOX: '$box',
  _POLYGON: '$polygon',
  _CENTER: '$center',
  _CENTER_SPHERE: '$centerSphere',
  _MAX_DISTANCE: '$maxDistance',
  _MIN_DISTANCE: '$minDistance',
};
const defaultValues: Resolvers = {};

export const isOperator = (
  key: string,
  keywords: Record<string, unknown>,
): boolean => {
  return Object.keys(keywords).includes(key);
};

export const isPrimitive = (val): boolean => {
  if (primitives.includes(typeof val)) {
    return true;
  } else {
    return false;
  }
};

export const isValidDate = (val): boolean => {
  return moment(val, moment.ISO_8601, true).isValid();
};

export const isComputable = (
  key: string,
  resolvers: Record<string, unknown>,
): boolean => {
  return Object.keys(resolvers).includes(key);
};

export const isNested = (
  value,
  keywords: Record<string, unknown>,
  resolvers: Record<string, unknown>,
): boolean => {
  if (typeof value !== 'object') {
    return false;
  }
  let nested = false;
  for (const key in value) {
    if (
      !isOperator(key, keywords) &&
      !isPrimitive(value[key]) &&
      !isComputable(key, resolvers)
    ) {
      nested = true;
      break;
    }
  }
  return nested;
};

export const computedValue = (
  parent: Record<string, unknown>,
  resolvers: Record<string, unknown>,
) => {
  for (const valueKey in resolvers) {
    if (parent[valueKey] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return resolvers[valueKey](parent);
    }
  }
};

export const argType = (
  keywords: Record<string, unknown>,
  resolvers: Record<string, unknown>,
  key?: string,
  val?: string,
): ArgType => {
  // tslint:disable-next-line:max-line-length
  if (isOperator(key, keywords)) {
    return 'OPERATOR';
  } else if (isComputable(key, resolvers)) {
    return 'COMPUTED';
  } else if (isPrimitive(val)) {
    return 'PRIMITIVE';
  } else if (Array.isArray(val)) {
    return 'ARRAY';
  } else if (isNested(val, keywords, resolvers)) {
    return 'NESTED';
  } else if (typeof val === 'object') {
    return 'FLAT';
  } else {
    return null;
  }
};

const parseNested = (
  keywords: Keywords,
  resolvers: Resolvers,
  key: string,
  val,
  lastResult = {},
) => {
  if (isComputable(key, resolvers)) {
    return buildFilters(val, key, keywords, resolvers);
  }
  let result = lastResult;

  // tslint:disable-next-line:forin
  for (const k in val) {
    let isFinal = false;

    // COMPUTABLE VALUE
    if (isComputable(k, resolvers)) {
      result = { ...result, ...buildFilters(val[k], k, keywords, resolvers) };
      return result;
    }

    // OPERATOR
    if (isOperator(k, keywords)) {
      result = {
        ...result,
        [key]: buildFilters(val, key, keywords, resolvers),
      };
      return result;
    }

    const subkey = key + '.' + k;
    const subval = val[k];

    // subval is COMPUTABLE VALUE
    if (isComputable(subkey, resolvers)) {
      result = {
        ...result,
        ...buildFilters(subval, subkey, keywords, resolvers),
      };
      isFinal = true;
    } else if (isPrimitive(subval)) {
      result[subkey] = buildFilters(subval, null, keywords, resolvers);
      isFinal = true;
    } else {
      // tslint:disable-next-line:forin
      for (const sk in subval) {
        const t = argType(keywords, resolvers, sk, subval);
        if (t !== 'NESTED' && t !== 'FLAT') {
          result[subkey] = buildFilters(subval, null, keywords, resolvers);
          isFinal = true;
          break;
        }
      }
    }
    if (!isFinal) {
      parseNested(keywords, resolvers, subkey, subval, result);
    }
  }
  return result;
};

export const buildFilters = (
  args,
  parentKey?: string,
  keywords: Keywords = {},
  resolvers: Resolvers = {},
) => {
  // PARENT IS A COMPUTABLE VALUE
  if (isComputable(parentKey, resolvers)) {
    return computedValue({ [parentKey]: args }, resolvers);
  }

  // NO PARENT AND ARGS IS A DIRECT VALUE
  if (!parentKey && isPrimitive(args)) {
    if (typeof args === 'string' && isValidDate(args)) {
      return new Date(args);
    }

    return args;
  }

  // ELSE, ARGS MUST BE ON OBJECT. LET'S ITERATE:
  let filters;

  // tslint:disable-next-line:forin
  for (const key in args) {
    if (!filters) {
      filters = {};
    }
    const val = args[key];
    const t = argType(keywords, resolvers, key, val);

    // COMPUTED VALUE
    if (isComputable(key, resolvers)) {
      const computed = buildFilters(val, key, keywords, resolvers);
      filters = {
        ...filters,
        ...computed,
      };
    } else if (t === 'OPERATOR') {
      const keyword = keywords[key];
      if (Array.isArray(val)) {
        filters[keyword] = val.map((v) =>
          buildFilters(v, null, keywords, resolvers),
        );
      } else {
        filters[keyword] = buildFilters(val, null, keywords, resolvers);
      }
    } else if (t === 'NESTED' || t === 'FLAT') {
      filters = { ...filters, ...parseNested(keywords, resolvers, key, val) };
    } else if (t === 'ARRAY') {
      filters[key] = val.map((v) => buildFilters(v, null, keywords, resolvers));
    } else {
      filters[key] = buildFilters(val, null, keywords, resolvers);
    }
  }
  return filters;
};

function GraphqlMongoParser(
  customKeywords: Keywords = {},
  customResolvers: Resolvers = {},
  merge = true,
) {
  const keywords: Keywords = merge
    ? { ...defaultKeywords, ...customKeywords }
    : customKeywords;
  const resolvers: Resolvers = merge
    ? { ...defaultValues, ...customResolvers }
    : customResolvers;
  return (args: Record<string, unknown>): Record<string, unknown> =>
    buildFilters(args, null, keywords, resolvers);
}

export const GqlMongoParser = GraphqlMongoParser();
