import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { Filterable } from '@ultimatebackend/core';
import { AppRole, InvitationStatus, Node } from '@ultimatebackend/contracts';
import { Tenant } from '../../tenants/types';
import { User } from '../../users/types';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Member extends Node {
  @Field()
  email: string;

  @Field({ nullable: true })
  userId: string;

  @Filterable()
  @Field(() => InvitationStatus)
  status: InvitationStatus;

  @Filterable()
  @Field(() => AppRole)
  role: AppRole;

  @Field(() => Tenant)
  tenant: Tenant;
}

@ObjectType()
export class MemberMutations {}
