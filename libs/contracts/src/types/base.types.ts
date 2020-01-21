/* tslint:disable:max-classes-per-file */
import { ObjectType, GraphQLISODateTime, Field, ID, ClassType } from 'type-graphql';
import { Filterable } from '@graphqlcqrs/core/decorators/filterable';

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
export class PageInfo {
  @Field()
  startCursor?: string;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;

  @Field()
  endCursor?: string;
}

// @ts-ignore
export default function ConnectionType<TItem>(TItemClass: ClassType<TItem>): any {
  @ObjectType(`${TItemClass.name}Edge`)
  class EdgeTypeClass {
    @Field(() => [TItemClass])
    node: TItem[];

    @Field()
    cursor: string;
  }

  @ObjectType(`${TItemClass.name}Connection`, { isAbstract: true })
  abstract class ConnectTypeClass {
    @Field(() => EdgeTypeClass)
    edge: EdgeTypeClass;

    @Field(() => PageInfo)
    pageInfo: PageInfo;
  }
  return ConnectTypeClass;
}
