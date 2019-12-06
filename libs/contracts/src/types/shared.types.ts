import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class BooleanPayload {
  @Field()
  success: boolean;
}
