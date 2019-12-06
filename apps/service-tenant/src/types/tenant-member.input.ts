/* tslint:disable:max-classes-per-file */
import { ArgsType, Field, ID, InputType } from 'type-graphql';
import { AppRole, FilterMongo } from '@ultimatebackend/contracts';
import { TenantMember } from './tenant-member.type';

@InputType()
export class CreateTenantMemberInput {
  @Field({ nullable: true })
  email: string;

  @Field(() => ID, { nullable: true })
  userId: string;

  @Field(() => AppRole)
  role: AppRole;
}

@InputType()
export class UpdateTenantMemberInput {
  @Field({ nullable: true })
  id: string;

  @Field(() => AppRole)
  role: AppRole;
}

@InputType()
export class RemoveTenantMemberInput {
  @Field(() => ID)
  id: string;
}

@ArgsType()
export class TenantMemberMutationArgs {

  @Field(() => CreateTenantMemberInput, { nullable: true })
  create?: CreateTenantMemberInput;

  @Field(() => RemoveTenantMemberInput, { nullable: true })
  remove?: RemoveTenantMemberInput;

  @Field(() => UpdateTenantMemberInput, { nullable: true })
  update?: UpdateTenantMemberInput;
}

@ArgsType()
export class TenantMemberFilterArgs extends FilterMongo(TenantMember) {}
