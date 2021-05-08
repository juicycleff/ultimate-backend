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
 * File name:         arango-aql.parser.spec.ts
 * Last modified:     22/03/2021, 23:04
 ******************************************************************************/

import { arangoAqlParser } from './arango-aql.parser';

describe('ArangoAqlParser', () => {
  it('can parse simple to arango query', () => {
    const query = {
      name: {
        _EQ: 'green',
      },
    };

    let result = arangoAqlParser(query);
    expect(result).toStrictEqual('doc.name == "green"');
    result = arangoAqlParser(query, 'obj');
    expect(result).toStrictEqual('obj.name == "green"');
  });

  it('can parse logical AND queries to arango query', () => {
    const query = {
      name: {
        _EQ: 'green',
      },
      _AND: [
        {
          lastName: {
            _EQ: 'John',
          },
        },
        {
          age: {
            _LT: 23,
          },
        },
      ],
    };

    const result = arangoAqlParser(query);
    expect(result).toStrictEqual(
      `doc.name == "green" AND (doc.lastName == "John" AND doc.age < 23)`
    );
  });

  it('can parse logical OR queries to arango query', () => {
    const query = {
      name: {
        _EQ: 'green',
      },
      _OR: [
        {
          lastName: {
            _EQ: 'John',
          },
        },
        {
          age: {
            _LT: 23,
          },
        },
      ],
    };

    const result = arangoAqlParser(query);
    expect(result).toStrictEqual(
      `doc.name == "green" AND (doc.lastName == "John" OR doc.age < 23)`
    );
  });

  it('can parse logical AND with OR queries to arango query', () => {
    const query = {
      name: {
        _EQ: 'green',
      },
      _AND: [
        {
          lastName: {
            _EQ: 'John',
          },
        },
        {
          age: {
            _LT: 23,
          },
        },
        {
          _OR: [
            {
              balance: {
                _GT: 8000,
              },
            },
            {
              nationality: {
                _NE: 'Bulu',
              },
            },
          ],
        },
      ],
    };

    const result = arangoAqlParser(query);
    expect(result).toStrictEqual(
      `doc.name == "green" AND (doc.lastName == "John" AND doc.age < 23 AND (doc.balance > 8000 OR doc.nationality != "Bulu"))`
    );
  });
});
