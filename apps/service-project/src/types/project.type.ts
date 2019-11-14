/* tslint:disable:max-classes-per-file */
import { Directive, Field, ObjectType } from 'type-graphql';
import { Node } from '@ultimatebackend/contracts';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Project extends Node {

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}
