import {
  Directive,
  ObjectType,
  Field,
  GraphQLISODateTime,
  Int,
} from '@nestjs/graphql';
import { Node } from '@ultimatebackend/contracts';
import { InvoiceStatus } from '@ultimatebackend/contracts/enums/billing.enum';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Invoice extends Node {
  @Field({ nullable: true })
  accountCountry?: string;

  @Field({ nullable: true })
  accountName?: string;

  @Field({ nullable: true })
  amountDue?: number;

  @Field({ nullable: true })
  amountPaid?: number;

  @Field({ nullable: true })
  amountRemaining?: number;

  @Field({ nullable: true })
  billingReason?: string;

  @Field({ nullable: true })
  currency?: string;

  // customerAddress: Stripe.IAddress;

  @Field({ nullable: true })
  customerEmail?: string;

  @Field({ nullable: true })
  customerName?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  endingBalance?: number;

  @Field({ nullable: true })
  hostedInvoiceUrl?: string;

  @Field({ nullable: true })
  invoicePdf?: string;

  @Field({ nullable: true })
  number?: string;

  @Field({ nullable: true })
  paid?: boolean;

  @Field({ nullable: true })
  receiptNumber?: string;

  @Field({ nullable: true })
  startingBalance?: number;

  @Field({ nullable: true })
  statementDescriptor?: string;

  @Field(() => InvoiceStatus, { nullable: true })
  status: InvoiceStatus;

  @Field(() => Int, { nullable: true })
  subtotal?: number;

  @Field({ nullable: true })
  tax?: number;

  @Field({ nullable: true })
  taxPercent?: number;

  @Field()
  total?: number;
}
