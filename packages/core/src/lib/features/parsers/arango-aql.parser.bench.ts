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

import { arangoAqlParser } from './arango-aql.parser';
import { benchmarkSuite } from 'jest-bench';

benchmarkSuite(
  'ArangoParserBenchmark',
  {
    ['Parse.Logical']: () => {
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

      arangoAqlParser(query);
    },

    ['Parse.DeepLogical']: () => {
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
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      arangoAqlParser(query);
    },
  },
  10000
);
