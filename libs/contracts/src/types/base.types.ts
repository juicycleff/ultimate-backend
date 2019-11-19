/* tslint:disable:max-classes-per-file */
import { ObjectType, GraphQLISODateTime, Field, ID } from 'type-graphql';

@ObjectType({ isAbstract: true })
export abstract class Node {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date | string;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date | string;
}

@ObjectType()
export class KeyValuePair {
  @Field()
  key: string;

  @Field({ nullable: true })
  value?: string;
}
