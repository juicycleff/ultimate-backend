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
 * File name:         base.types.ts
 * Last modified:     22/03/2021, 16:18
 ******************************************************************************/
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { ClassType } from '@ultimate-backend/common';
import { FilterableField } from '../decorator';
import { CursorScaler } from '../scalers';

@ObjectType('Node', { isAbstract: true })
export abstract class NodeSchema<T> {
  @FilterableField()
  @Field(() => ID)
  id: T;

  @FilterableField()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @FilterableField()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

@ObjectType()
class PageInfo {
  @Field(() => CursorScaler, { nullable: true })
  startCursor?: string;

  @Field({ nullable: true })
  hasNextPage: boolean;

  @Field({ nullable: true })
  hasPreviousPage: boolean;

  @Field(() => CursorScaler, { nullable: true })
  endCursor?: string;
}

export function ExtendConnectionType<TItem>(TItemClass: ClassType<TItem>): any {
  @ObjectType(`${TItemClass.name}Edge`)
  class EdgeTypeClass {
    @Field(() => TItemClass)
    node: TItem;

    @Field(() => CursorScaler)
    cursor: string;
  }

  @ObjectType(`${TItemClass.name}Connection`, { isAbstract: true })
  abstract class ConnectionTypeClass {
    @Field(() => [EdgeTypeClass], { nullable: true })
    edges?: [EdgeTypeClass];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
  }

  return ConnectionTypeClass;
}
