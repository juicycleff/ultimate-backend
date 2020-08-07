import { ObjectType, GraphQLISODateTime, Field, ID } from '@nestjs/graphql';
import { Filterable } from '@ultimatebackend/core/decorators/filterable';
import { CursorScaler } from '@ultimatebackend/core/scalers';
import { ClassType } from '@ultimatebackend/common';

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

@ObjectType()
export class GeoLocation {
  @Field()
  longitude?: string;

  @Field()
  latitude?: string;
}
