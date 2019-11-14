/* tslint:disable:max-classes-per-file */
import { Int, ArgsType, Field, InputType } from 'type-graphql';

@InputType()
export class PaginationInput {
  @Field(() => Int)
  skip: number = 0;

  @Field(() => Int)
  limit: number = 10;
}

@ArgsType()
export class PaginationArgs {
  @Field(() => PaginationInput)
  paginate?: PaginationInput;
}
