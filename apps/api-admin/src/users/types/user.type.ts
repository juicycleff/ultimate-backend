import { Directive, Field, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
export class ProfileMutations {}

@Directive(`@key(fields: "id")`)
@ObjectType()
export class User extends Node {
  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field(() => [String!], { defaultValue: [] })
  roles: string[];

  @Field()
  primaryEmail: string;

  @Field(() => [EmailObject!])
  emails: EmailObject;
}
