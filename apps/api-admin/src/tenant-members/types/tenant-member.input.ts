import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import { AppRole, FilterMongo, InvitationStatus, PaginationInput } from '@ultimatebackend/contracts';
import { Member } from './tenant-member.type';

@InputType()
export class InviteMemberInput {

  @Field({ nullable: true })
  email?: string;

  @Field(() => ID, { nullable: true })
  userId?: string;

  @Field(() => AppRole)
  role: AppRole;
}

@InputType()
export class UpdateMemberInput {

  @Field(() => ID, { nullable: true })
  id: string;

  @Field(() => AppRole)
  role: AppRole;
}

@InputType()
export class DeleteMemberInput {
  @Field(() => ID)
  id: string;

  @Field()
  tenantId: string;
}

@InputType()
export class MemberFilterInput extends FilterMongo(Member, { simple: true }) {}

@ArgsType()
export class MemberFilterArgs {
  @Field(() => MemberFilterInput, { nullable: true })
  where?: MemberFilterInput;

  @Field(() => PaginationInput, { nullable: true })
  paginate?: PaginationInput;
}
