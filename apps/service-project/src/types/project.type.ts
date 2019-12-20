/* tslint:disable:max-classes-per-file */
import { Directive, Field, ObjectType } from 'type-graphql';
import { Node } from '@ultimatebackend/contracts';
import { Filterable } from '@graphqlcqrs/core';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Project extends Node {

  @Filterable()
  @Field()
  name: string;

  @Filterable()
  @Field({ nullable: true })
  description?: string;
}
