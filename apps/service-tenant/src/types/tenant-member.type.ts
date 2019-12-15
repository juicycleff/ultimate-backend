import { Directive, Field, ObjectType } from 'type-graphql';
import { Filterable } from '@graphqlcqrs/core';
import { AppRole, InvitationStatus, Node } from '@ultimatebackend/contracts';
import { Tenant } from './tenant.type';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class TenantMember extends Node {

  @Filterable()
  @Field()
  email: string;

  @Filterable()
  @Field()
  status: InvitationStatus;

  @Filterable()
  @Field()
  role: AppRole;

  @Field(() => Tenant)
  tenant: Tenant;
}
