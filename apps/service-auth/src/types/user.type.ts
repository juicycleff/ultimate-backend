import { Directive, Field, ObjectType, ID } from 'type-graphql/dist';
import { AuthPayload } from './auth-payload.type';

@ObjectType()
@Directive('@extends')
@Directive(`@key(fields: "id")`)
export class User {

  @Directive('@external')
  @Field(() => ID)
  id: string;

  @Field(() => AuthPayload)
  auth: AuthPayload;
}
