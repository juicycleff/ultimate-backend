/* tslint:disable:max-classes-per-file */
import { Directive, Field, ID, ObjectType } from 'type-graphql/dist';

@ObjectType()
export class Tokens {
  @Field()
  refreshToken: string;

  @Field()
  accessToken: string;
}

@Directive(`@key(fields: "id")`)
@ObjectType()
export class AuthPayload {

  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  sessionId?: string;

  @Field({ nullable: true })
  tokens?: Tokens;
}
