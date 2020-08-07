import { InputType, ArgsType, Field, ID } from '@nestjs/graphql';
import { FilterMongo, PaginationInput } from '@ultimatebackend/contracts';
import { Tenant, TenantSettings } from './tenant.type';

@InputType()
export class CreateTenantInput {
  @Field()
  name: string;

  @Field()
  planId: string;

  @Field({ nullable: true })
  couponId?: string;

  @Field({ nullable: true })
  cardId?: string;
}

@InputType()
export class DeleteTenantInput {
  @Field(() => ID)
  id: string;
}

@InputType()
export class UpdateTenantPayloadInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  settings: TenantSettings;
}

@InputType()
export class UpdateTenantInput {
  @Field()
  id: string;

  @Field(() => UpdateTenantPayloadInput, { nullable: true })
  data: UpdateTenantPayloadInput;
}

@InputType()
export class UpdateTenantAccessTokenInput {
  @Field({
    description: 'Key of the access token to update',
  })
  key: string;

  @Field({
    description: 'Secret of the access token to update',
  })
  secret: string;

  @Field()
  active: boolean;
}

@InputType()
export class RemoveTenantAccessTokenInput {
  @Field({
    description: 'Key of the access token to remove',
  })
  key: string;

  @Field({
    description: 'Secret of the access token to remove',
  })
  secret: string;
}

@ArgsType()
export class TenantMutationArgs {
  @Field(() => CreateTenantInput, { nullable: true })
  create?: CreateTenantInput;

  @Field(() => DeleteTenantInput, { nullable: true })
  remove?: DeleteTenantInput;

  @Field(() => UpdateTenantInput, { nullable: true })
  update?: UpdateTenantInput;

  @Field(() => UpdateTenantAccessTokenInput, { nullable: true })
  updateAccessToken?: UpdateTenantAccessTokenInput;

  @Field(() => RemoveTenantAccessTokenInput, { nullable: true })
  removeAccessToken?: RemoveTenantAccessTokenInput;
}

@InputType()
export class TenantFilterInput extends FilterMongo(Tenant, { simple: true }) {}

@ArgsType()
export class TenantFilterArgs {
  @Field(() => TenantFilterInput, { nullable: true })
  where?: TenantFilterInput;

  @Field(() => PaginationInput, { nullable: true })
  paginate?: PaginationInput;
}
