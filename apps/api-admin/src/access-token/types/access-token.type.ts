import { ObjectType, Directive, Field } from '@nestjs/graphql';
import { Node } from '@ultimatebackend/contracts';
import { Filterable } from '@ultimatebackend/core';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class AccessToken extends Node {
  @Field(() => [String])
  scopes: string[];

  @Field()
  token: string;

  @Filterable()
  @Field({ nullable: true })
  active: boolean;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  expireAt: string;
}

@ObjectType()
export class AccessTokenMutations {}
