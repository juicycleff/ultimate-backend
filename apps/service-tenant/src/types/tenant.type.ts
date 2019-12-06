/* tslint:disable:max-classes-per-file */
import { ObjectType, Directive, GraphQLISODateTime } from 'type-graphql';
import { Field } from 'type-graphql/dist/decorators/Field';
import {  Node } from '@ultimatebackend/contracts';
import { TenantMember } from './tenant-member.type';
import { Filterable } from '@graphqlcqrs/core';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Tenant extends Node {

  @Filterable()
  @Field({ nullable: true })
  name: string;

  @Filterable()
  @Field({ nullable: true })
  normalizedName: string;

  @Field(() => [TenantAccessToken!], { nullable: true })
  tokens?: TenantAccessToken[];

  @Filterable({ type: TenantMember })
  @Field(() => [TenantMember!], { nullable: true })
  members?: TenantMember[];
}

@ObjectType()
export class TenantAccessToken {

  @Field()
  key: string;

  @Field()
  secret: string;

  @Field({ defaultValue: true })
  active: boolean;

  @Field(() => GraphQLISODateTime, { defaultValue: new Date().toISOString()})
  createdAt: Date | string;
}
