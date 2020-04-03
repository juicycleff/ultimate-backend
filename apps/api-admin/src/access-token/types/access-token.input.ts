import { InputType, ArgsType, Field, ID } from '@nestjs/graphql';
import { FilterMongo, PaginationInput } from '@ultimatebackend/contracts';
import { AccessToken } from './access-token.type';

@InputType()
export class CreateAccessTokenInput {
  @Field()
  name: string;

  @Field(() => [String], { nullable: true })
  scopes?: string[];
}

@InputType()
export class DeleteAccessTokenInput {
  @Field(() => ID)
  id: string;
}

@InputType()
export class AccessTokenFilterInput extends FilterMongo(AccessToken, { simple: true }) {}

@ArgsType()
export class AccessTokenFilterArgs {
  @Field(() => AccessTokenFilterInput, { nullable: true })
  where?: AccessTokenFilterInput;

  @Field(() => PaginationInput, { nullable: true })
  paginate?: PaginationInput;
}
