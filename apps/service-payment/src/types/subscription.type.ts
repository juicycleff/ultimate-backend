import { Directive, ObjectType, Field, GraphQLISODateTime } from 'type-graphql/dist';
import { Node, SubscriptionStatus } from '@ultimatebackend/contracts';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class TenantSubscription extends Node {

  @Field()
  tenantId?: string;

  @Field(() => SubscriptionStatus)
  status?: SubscriptionStatus;

  @Field(() => GraphQLISODateTime)
  canceledAt?: Date;

  @Field(() => GraphQLISODateTime)
  cancelAt?: Date;
}
