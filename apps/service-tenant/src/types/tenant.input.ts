/* tslint:disable:max-classes-per-file */
import { InputType, ArgsType, Field, ID } from 'type-graphql';
import { FilterMongo, PaginationInput } from '@ultimatebackend/contracts';
import { Tenant } from './tenant.type';

@InputType()
export class CreateTenantInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  planId?: string;

  @Field({ nullable: true })
  couponId?: string;
}

@InputType()
export class RemoveTenantInput {
  @Field(() => ID)
  id: string;
}

@InputType()
export class UpdateTenantInput {
  @Field()
  id: string;
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

  @Field(() => RemoveTenantInput, { nullable: true })
  remove?: RemoveTenantInput;

  @Field(() => UpdateTenantInput, { nullable: true })
  update?: UpdateTenantInput;

  @Field(() => UpdateTenantAccessTokenInput, { nullable: true })
  updateAccessToken?: UpdateTenantAccessTokenInput;

  @Field(() => RemoveTenantAccessTokenInput, { nullable: true })
  removeAccessToken?: RemoveTenantAccessTokenInput;
}

@InputType()
export class TenantFilter extends FilterMongo(Tenant, { simple: true }) {}

@ArgsType()
export class TenantFilterArgs {
  @Field(() => TenantFilter, { nullable: true })
  where?: TenantFilter;

  @Field(() => PaginationInput, { nullable: true })
  paginate?: PaginationInput;
}
