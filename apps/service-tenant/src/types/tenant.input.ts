/* tslint:disable:max-classes-per-file */
import { InputType, ArgsType, Field } from 'type-graphql';
import { FilterMongo } from '@ultimatebackend/contracts';
import { Tenant } from './tenant.type';

@InputType()
export class CreateTenantInput {
  @Field()
  name: string;
}

@ArgsType()
export class TenantFilterArgs extends FilterMongo(Tenant) {}
