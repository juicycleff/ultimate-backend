import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import { RoleActions } from '@ultimatebackend/contracts/enums/roles.enum';

@InputType()
export class CreateRoleInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  tenant!: string;

  @Field()
  resource: string;

  @Field(() => RoleActions)
  action!: RoleActions;
}

@InputType()
export class RemoveRoleInput {
  @Field(() => ID)
  id: string;
}

@ArgsType()
export class RoleMutationArgs {
  @Field(() => CreateRoleInput, { nullable: true })
  create?: CreateRoleInput;

  @Field(() => RemoveRoleInput, { nullable: true })
  remove?: RemoveRoleInput;
}
