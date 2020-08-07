import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import { AppRole, InvitationStatus } from '@ultimatebackend/contracts';

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
export class MemberFilterInput {
  @Field(() => InvitationStatus, { nullable: true })
  status: InvitationStatus;

  @Field(() => AppRole, { nullable: true })
  role: AppRole;

  @Field({ nullable: true })
  tenantId: string;
}

@ArgsType()
export class MemberFilterArgs {
  @Field(() => MemberFilterInput, { nullable: true })
  where?: MemberFilterInput;
}
