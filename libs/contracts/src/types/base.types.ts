/* tslint:disable:max-classes-per-file */
import { ObjectType, GraphQLISODateTime, Field, ID } from 'type-graphql';
import { Filterable } from '@graphqlcqrs/core';

@ObjectType({ isAbstract: true })
export abstract class Node {
  @Filterable()
  @Field(() => ID)
  id: string;

  @Filterable()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Filterable()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

@ObjectType()
export class KeyValuePair {
  @Field()
  key: string;

  @Field({ nullable: true })
  value?: string;
}
