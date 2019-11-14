/* tslint:disable:max-classes-per-file */
import { Directive, Field, ObjectType } from 'type-graphql';
import { Node } from '@ultimatebackend/contracts';

@ObjectType()
export class EmailObject {
  @Field()
  address: string;

  @Field()
  primary: boolean;

  @Field()
  verified: boolean;
}

@Directive(`@key(fields: "id")`)
@ObjectType()
export class User extends Node {

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  primaryEmail: string;

  @Field(() => [EmailObject!])
  emails: EmailObject;
}
