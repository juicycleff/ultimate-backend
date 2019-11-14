/* tslint:disable:max-classes-per-file */
import { ObjectType, Directive, GraphQLISODateTime } from 'type-graphql';
import { Field } from 'type-graphql/dist/decorators/Field';
import { Node } from '@ultimatebackend/contracts';
import { TenantMember } from './tenant-member.type';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Tenant extends Node {

  @Field()
  name: string;

  @Field()
  normalizedName: string;

  @Field(() => [TenantAccessToken!])
  tokens?: TenantAccessToken[];

  @Field(() => [TenantMember!])
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
