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
  _OR: ' AND ',
  _AND: ' OR ',
};

export function arangoQueryBuilder(query: object, docName?: string, grouped?: boolean) {
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
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < val.length; i++) {
          aqlOr.push(arangoQueryBuilder(val[i]));
        }
        returnOrStr = '(' + aqlOr.join(logicalOperators.OR) + ')';
      } else if (prop === '_OR') {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < val.length; i++) {
          aqlOr.push(arangoQueryBuilder(val[i]));
        }
        returnOrStr = '(' + aqlOr.join(logicalOperators._OR) + ')';
      } else if (prop === '$and') {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < val.length; i++) {
          aqlOr.push(arangoQueryBuilder(val[i]));
        }
        returnOrStr = '(' + aqlOr.join(logicalOperators._AND) + ')';
      } else if (prop === '_AND') {
        // tslint:disable-next-line:prefer-for-of
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
    str =  aql.join(logicalOperators.AND);
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
