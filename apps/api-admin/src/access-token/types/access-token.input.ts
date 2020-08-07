import { InputType, ArgsType, Field, ID } from '@nestjs/graphql';
import { FilterMongo, PaginationInput } from '@ultimatebackend/contracts';
import { AccessToken } from './access-token.type';
import { WithTenantInput } from '../../common';

@InputType()
export class CreateAccessTokenInput extends WithTenantInput {
  @Field()
  name: string;

  @Field(() => [String], { nullable: true })
  scopes?: string[];

  @Field({ nullable: true })
  expireAt: string;
}

@InputType()
export class DeleteAccessTokenInput extends WithTenantInput {
  @Field(() => ID)
  id: string;
}

@InputType()
export class AccessTokenFilterInput extends FilterMongo(AccessToken, {
  simple: true,
}) {
  @Field({ nullable: true })
  tenantId: string;
}

@ArgsType()
export class AccessTokenFilterArgs {
  @Field(() => AccessTokenFilterInput, { nullable: true })
  where?: AccessTokenFilterInput;

  @Field(() => PaginationInput, { nullable: true })
  paginate?: PaginationInput;
}

@InputType()
export class ReadAccessTokenInput extends WithTenantInput {
  @Field(() => ID)
  id: string;
}
