/* tslint:disable:max-classes-per-file */
import { Directive, Field, ID, ObjectType } from 'type-graphql';
import { User } from './user.type';

@Directive('@extends')
@Directive(`@key(fields: "id")`)
@ObjectType()
export class AuthPayload {

  @Directive(`@external`)
  @Field(() => ID)
  id: string;

  @Field()
  user?: User;
}
