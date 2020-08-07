import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/types';
import { AccountsMutationResolver } from '../accounts-mutation.resolver';

@ObjectType()
export class Tokens {
  @Field()
  refreshToken: string;

  @Field()
  accessToken: string;
}

@ObjectType()
export class ExpirableTokens {
  @Field({ nullable: true })
  sub: string;

  @Field({ nullable: true })
  value: string;

  @Field({ nullable: true })
  iat: string;
}

@ObjectType()
export class VerificationLinkInfo {
  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  pincode: string;
}

@ObjectType()
export class AccountMutations {}

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Account {
  @Field(() => ID)
  id: string;

  @Field()
  user?: User;

  @Field()
  tokens?: Tokens;
}

@ObjectType()
export class AccountRegisterResponse {
  @Field()
  activationLink?: string;
}
