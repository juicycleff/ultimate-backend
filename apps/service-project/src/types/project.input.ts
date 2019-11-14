/* tslint:disable:max-classes-per-file */
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateProjectInput {

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}
