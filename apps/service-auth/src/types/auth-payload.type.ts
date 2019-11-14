/* tslint:disable:max-classes-per-file */
import { Directive, Field, ID, ObjectType } from 'type-graphql/dist';

@ObjectType()
export class Tokens {
  @Field()
  refreshToken: string;

  @Field()
  accessToken: string;
}

@ObjectType()
export class BooleanPayload {
  @Field()
  success: boolean;
}

@Directive(`@key(fields: "id")`)
@ObjectType()
export class AuthPayload {

  @Field(() => ID)
  id: string;

  @Field()
  sessionId?: string;

  @Field()
  tokens?: Tokens;
}
