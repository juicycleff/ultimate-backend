/* tslint:disable:max-classes-per-file */
import { Field, InputType, ID, ArgsType } from 'type-graphql';
import { FilterMongo, PaginationInput } from '@ultimatebackend/contracts';
import { Project } from './project.type';

@InputType()
export class CreateProjectInput {

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class DeleteProjectInput {

  @Field(() => ID)
  id: string;
}

@InputType()
export class UpdateProjectDataInput {

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdateProjectInput {

  @Field(() => ID)
  id: string;

  @Field(() => UpdateProjectDataInput)
  data: UpdateProjectDataInput;
}

@ArgsType()
export class ProjectMutations {

  @Field(() => CreateProjectInput, { nullable: true })
  create?: CreateProjectInput;

  @Field(() => UpdateProjectInput, { nullable: true })
  update?: UpdateProjectInput;

  @Field(() => DeleteProjectInput, { nullable: true })
  delete?: DeleteProjectInput;
}

@InputType()
export class ProjectFilterInput extends FilterMongo(Project, { simple: true }) {}

@ArgsType()
export class ProjectFilterArgs {
  @Field(() => ProjectFilterInput, { nullable: true })
  where?: ProjectFilterInput;

  @Field(() => PaginationInput, { nullable: true })
  paginate?: PaginationInput;
}
