import { Directive, ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Node } from '@ultimatebackend/contracts';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class TenantSubscription extends Node {

  @Field()
  status?: string;

  @Field(() => GraphQLISODateTime)
  canceledAt?: Date;

  @Field(() => GraphQLISODateTime)
  cancelAt?: Date;
}
