import {
  Directive,
  ObjectType,
  Field,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { Node } from '@ultimatebackend/contracts';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class TenantSubscription extends Node {
  @Field()
  status?: string;

  @Field()
  tenantId?: string;

  @Field(() => GraphQLISODateTime)
  canceledAt?: Date;

  @Field(() => GraphQLISODateTime)
  cancelAt?: Date;

  @Field({ nullable: true })
  collectionMethod: string;
  @Field({ nullable: true })
  currentPeriodStart: string;
  @Field({ nullable: true })
  currentPeriodEnd: string;
  @Field(() => GraphQLISODateTime, { nullable: true })
  endedAt: Date;
  @Field({ nullable: true })
  latestInvoiceId: string;
  @Field({ nullable: true })
  startDate: string;
  @Field({ nullable: true })
  trialStart: string;
  @Field({ nullable: true })
  trialEnd: string;
  @Field({ nullable: true })
  customerEmail: string;
  @Field({ nullable: true })
  customerName: string;
}
