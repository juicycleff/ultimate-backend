/* tslint:disable:max-classes-per-file */
import { Field, InputType, ID, ArgsType } from 'type-graphql';
import { FilterMongo, PaginationInput } from '@ultimatebackend/contracts';
import { User } from './user.type';

@InputType()
export class DeleteUserInput {

  @Field(() => ID)
  id: string;
}

@InputType()
export class UpdateUserDataInput {
}

@InputType()
export class UpdateUserInput {

  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname?: string;
}

@ArgsType()
export class UserMutations {
  @Field(() => UpdateUserInput, { nullable: true })
  updateProfile?: UpdateUserInput;

  @Field(() => DeleteUserInput, { nullable: true })
  deleteAccount?: DeleteUserInput;
}

@InputType()
export class UserFilterInput extends FilterMongo(User, { simple: true }) {}

@ArgsType()
export class ProjectFilterArgs {
  @Field(() => UserFilterInput, { nullable: true })
  where?: UserFilterInput;

  @Field(() => PaginationInput, { nullable: true })
  paginate?: PaginationInput;
}
