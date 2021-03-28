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
 * File name:         user.schema.ts
 * Last modified:     22/03/2021, 15:42
 ******************************************************************************/
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PostSchema } from './post.schema';
import { FilterableField, NodeSchema } from '@ultimate-backend/core';

export enum BioSex {
  Male,
  Female,
}

registerEnumType(BioSex, {
  name: 'BioSex',
});

@ObjectType('User')
export class UserSchema extends NodeSchema<number> {
  @FilterableField(() => Int)
  @Field((type) => Int)
  id: number;

  @FilterableField()
  @Field({ nullable: true })
  firstName?: string;

  @FilterableField()
  @Field({ nullable: true })
  lastName?: string;

  @FilterableField((returns) => PostSchema)
  @Field((type) => [PostSchema])
  posts: PostSchema[];

  @FilterableField(() => BioSex)
  @Field((type) => BioSex)
  sex: BioSex;
}
