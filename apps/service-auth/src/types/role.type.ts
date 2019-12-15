import { Directive, Field, ObjectType, ID } from 'type-graphql/dist';
import { Node } from '@ultimatebackend/contracts';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Role extends Node {

  @Field()
  name: string;

  @Field()
  normalizedName!: string;
}
