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
 * File name:         arango-aql.parser.ts
 * Last modified:     22/03/2021, 23:01
 ******************************************************************************/
const operators = {
  $eq: '==',
  $gt: '>',
  $gte: '>=',
  $lt: '<',
  $lte: '<=',
  $ne: '!=',
  _ALL: '$all',
  _IN: 'IN',
  _NIN: 'NOT IN',
  _LK: 'LIKE',
  _NLK: 'NOT LIKE',
  _EQ: '==',
  _NE: '!=',
  _LT: '<',
  _LTE: '<=',
  _GT: '>',
  _GTE: '>=',
};

const logicalOperators = {
  AND: ' AND ',
  OR: ' OR ',
  _OR: ' OR ',
  _AND: ' AND ',
};

function arangoQueryBuilder(query: any, docName?: string, grouped?: boolean) {
  const doc = docName;
  const group = grouped;

  const aql = [];
  const aqlOr = [];
  let returnOrStr = '';
  let str = '';

  for (let prop in query) {
    // eslint-disable-next-line no-prototype-builtins
    if (query.hasOwnProperty(prop)) {
      const val = query[prop];
      let op = operators.$eq;
      const isOperator = operators[prop];

      if (isOperator) {
        op = operators[prop];
        prop = '';
      }
      if (prop === '$or') {
        for (let i = 0; i < val.length; i++) {
          aqlOr.push(arangoQueryBuilder(val[i]));
        }
        returnOrStr = '(' + aqlOr.join(logicalOperators.OR) + ')';
      } else if (prop === '_OR') {
        for (let i = 0; i < val.length; i++) {
          aqlOr.push(arangoQueryBuilder(val[i]));
        }
        returnOrStr = '(' + aqlOr.join(logicalOperators._OR) + ')';
      } else if (prop === '$and') {
        for (let i = 0; i < val.length; i++) {
          aqlOr.push(arangoQueryBuilder(val[i]));
        }
        returnOrStr = '(' + aqlOr.join(logicalOperators._AND) + ')';
      } else if (prop === '_AND') {
        for (let i = 0; i < val.length; i++) {
          aqlOr.push(arangoQueryBuilder(val[i]));
        }
        returnOrStr = '(' + aqlOr.join(logicalOperators._AND) + ')';
      } else {
        switch (typeof val) {
          case 'number':
          case 'boolean':
            aql.push(prop + ' ' + op + ' ' + val);
            break;
          case 'string':
            aql.push(prop + ' ' + op + ' "' + val + '"');
            break;
          case 'object':
            aql.push(prop + arangoQueryBuilder(val, null, false));
            break;
        }
      }
    }
  }

  if (group) {
    if (aql.length) {
      str = '(' + aql.join(logicalOperators.AND) + ')';
    }
  } else {
    str = aql.join(logicalOperators.AND);
  }

  if (returnOrStr) {
    if (str) {
      str += logicalOperators.AND;
    }
    str += returnOrStr;
  }

  if (doc) {
    str = str.replace(/(\w+)(\s[!=<>])/g, doc + '.$1$2');
  }

  return str;
}

function GraphqlArangoParser() {
  return (
    args: Record<string, unknown>,
    docName = 'doc',
    grouped?: boolean
  ): string => {
    return arangoQueryBuilder(args, docName, grouped);
  };
}

export const arangoAqlParser = GraphqlArangoParser();
