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
    if (query.hasOwnProperty(prop)) {
      const val = query[prop];
      let op = operators.$eq;
      const isOperator = operators[prop];

      if (isOperator) {
        op = operators[prop];
        prop = '';
      }
      if (prop === '$or') {
        for (const el of val) {
          aqlOr.push(arangoQueryBuilder(el));
        }
        returnOrStr = '(' + aqlOr.join(logicalOperators.OR) + ')';
      } else if (prop === '_OR') {
        for (const el of val) {
          aqlOr.push(arangoQueryBuilder(el));
        }
        returnOrStr = '(' + aqlOr.join(logicalOperators._OR) + ')';
      } else if (prop === '$and') {
        for (const el of val) {
          aqlOr.push(arangoQueryBuilder(el));
        }
        returnOrStr = '(' + aqlOr.join(logicalOperators._AND) + ')';
      } else if (prop === '_AND') {
        for (const el of val) {
          aqlOr.push(arangoQueryBuilder(el));
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
    grouped?: boolean,
  ): string => {
    return arangoQueryBuilder(args, docName, grouped);
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const gqlArangoParser = GraphqlArangoParser();
