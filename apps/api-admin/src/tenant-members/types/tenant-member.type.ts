import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { Filterable } from '@ultimatebackend/core';
import { AppRole, InvitationStatus, Node } from '@ultimatebackend/contracts';
import { Tenant } from '../../tenants/types';
import { User } from '../../users/types';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Member extends Node {

  @Filterable()
  @Field()
  email: string;

  @Filterable()
  @Field(() => InvitationStatus)
  status: InvitationStatus;

  @Field(() => User)
  user?: User;

  @Filterable()
  @Field(() => AppRole)
  role: AppRole;

  @Field(() => Tenant)
  tenant: Tenant;
}

@ObjectType()
export class MemberMutations {}
