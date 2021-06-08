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
 * File name:         mongo.parser.spec.ts
 * Last modified:     22/03/2021, 23:04
 ******************************************************************************/

import { mongoParser } from './mongo.parser';

describe('MongoParser', () => {
  it('can parse simple to mongo query', () => {
    const query = {
      name: {
        _EQ: 'green',
      },
    };

    const result = mongoParser(query);
    expect(result).toStrictEqual({
      name: {
        $eq: 'green',
      },
    });
  });

  it('can parse logical AND queries to mongo query', () => {
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

    const result = mongoParser(query);
    expect(result).toStrictEqual({
      name: {
        $eq: 'green',
      },
      $and: [
        {
          lastName: {
            $eq: 'John',
          },
        },
        {
          age: {
            $lt: 23,
          },
        },
      ],
    });
  });

  it('can parse logical OR queries to mongo query', () => {
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

    const result = mongoParser(query);
    expect(result).toStrictEqual({
      name: {
        $eq: 'green',
      },
      $or: [
        {
          lastName: {
            $eq: 'John',
          },
        },
        {
          age: {
            $lt: 23,
          },
        },
      ],
    });
  });

  it('can parse logical AND with OR queries to mongo query', () => {
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

    const result = mongoParser(query);
    expect(result).toStrictEqual({
      name: {
        $eq: 'green',
      },
      $and: [
        {
          lastName: {
            $eq: 'John',
          },
        },
        {
          age: {
            $lt: 23,
          },
        },
        {
          $or: [
            {
              balance: {
                $gt: 8000,
              },
            },
            {
              nationality: {
                $ne: 'Bulu',
              },
            },
          ],
        },
      ],
    });
  });
});
