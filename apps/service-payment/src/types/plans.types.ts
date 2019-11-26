import { Field, ObjectType } from 'type-graphql';
import { KeyValuePair, Node } from '@ultimatebackend/contracts/types';

@ObjectType()
export class Plan extends Node {
  @Field()
  name: string;

  @Field()
  normalizedName: string;

  @Field(() =>  [KeyValuePair!])
  features: KeyValuePair[];

}
