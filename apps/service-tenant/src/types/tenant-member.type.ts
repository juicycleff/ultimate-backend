import { Directive, Field, ObjectType } from 'type-graphql';
import { AppRole, InvitationStatus, Node } from '@ultimatebackend/contracts';
import { Tenant } from './tenant.type';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class TenantMember extends Node {

  @Field()
  email: string;

  @Field()
  status: InvitationStatus;

  @Field()
  role: AppRole;

  @Field(() => Tenant)
  tenant: Tenant;
}
