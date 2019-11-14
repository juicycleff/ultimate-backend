import { Directive, Field, ObjectType, ID } from 'type-graphql';
import { Tenant } from './tenant.type';

@ObjectType()
@Directive('@extends')
@Directive(`@key(fields: "id")`)
export class User {

  @Directive('@external')
  @Field(() => ID)
  id: string;

  @Field(() => [Tenant!])
  tenants: Tenant[];
}
