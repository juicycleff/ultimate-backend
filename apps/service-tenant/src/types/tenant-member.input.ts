/* tslint:disable:max-classes-per-file */
import { ArgsType, Field, ID, InputType } from 'type-graphql';
import { AppRole, FilterMongo, PaginationInput } from '@ultimatebackend/contracts';
import { TenantMember } from './tenant-member.type';

@InputType()
export class InviteTenantMemberInput {
  @Field()
  tenantId: string;

  @Field({ nullable: true })
  email?: string;

  @Field(() => ID, { nullable: true })
  userId?: string;

  @Field(() => AppRole)
  role: AppRole;
}

@InputType()
export class UpdateTenantMemberInput {
  @Field()
  tenantId: string;

  @Field({ nullable: true })
  id: string;

  @Field(() => AppRole)
  role: AppRole;
}

@InputType()
export class RemoveTenantMemberInput {
  @Field(() => ID)
  id: string;

  @Field()
  tenantId: string;
}

@ArgsType()
export class TenantMemberMutationArgs {

  @Field(() => InviteTenantMemberInput, { nullable: true })
  invite?: InviteTenantMemberInput;

  @Field(() => RemoveTenantMemberInput, { nullable: true })
  remove?: RemoveTenantMemberInput;

  @Field(() => UpdateTenantMemberInput, { nullable: true })
  update?: UpdateTenantMemberInput;
}

@InputType()
export class TenantMemberFilterInput extends FilterMongo(TenantMember, { simple: true }) {}

@ArgsType()
export class TenantMemberFilterInputArgs {
  @Field(() => TenantMemberFilterInput, { nullable: true })
  where?: TenantMemberFilterInput;

  @Field(() => PaginationInput, { nullable: true })
  paginate?: PaginationInput;
}
