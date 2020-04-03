import { ObjectType, Directive, GraphQLISODateTime, Field, InputType } from '@nestjs/graphql';
import {  Node } from '@ultimatebackend/contracts';
import { Filterable } from '@ultimatebackend/core';
import { Member } from '../../tenant-members/types';

@InputType('TenantSettingsInput')
@ObjectType()
export class TenantSettings {
  @Field({ nullable: true })
  enableTheme: boolean;
}

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Tenant extends Node {

  @Filterable()
  @Field({ nullable: true })
  name: string;

  @Filterable()
  @Field({ nullable: true })
  normalizedName: string;

  @Field(() => TenantSettings, { nullable: true })
  settings?: TenantSettings;

  @Filterable(() =>  Member)
  @Field(() => [Member!], { nullable: true })
  members?: Member[];
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

@ObjectType()
export class TenantMutations {}
