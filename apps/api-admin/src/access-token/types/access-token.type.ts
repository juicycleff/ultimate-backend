import { ObjectType, Directive, Field } from '@nestjs/graphql';
import {  Node } from '@ultimatebackend/contracts';
import { Filterable } from '@ultimatebackend/core';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class AccessToken extends Node {

  @Field(() => [String])
  scopes: string[];

  @Field()
  token: string;

  @Field({ nullable: true })
  active: boolean;

  @Filterable()
  @Field({ nullable: true })
  name: string;

}

@ObjectType()
export class AccessTokenMutations {}
