/* tslint:disable:variable-name */
import * as Stripe from 'stripe';
import { AggregateRoot } from '@nestjs/cqrs';

export class Customer extends AggregateRoot
  implements Stripe.customers.ICustomer {
  userId?: string;
  account_balance: number;
  address: Stripe.IAddress | null;
  balance: number;
  cards: Stripe.resources.CustomerCards;
  created: number;
  currency: string | null;
  default_source: string | Stripe.IStripeSource | null;
  delinquent: boolean;
  description: string;
  discount: Stripe.coupons.IDiscount;
  email: string;
  id: string;
  invoice_prefix: string;
  invoice_settings: Stripe.customers.ICustomerInvoiceSettings | null;
  livemode: boolean;
  metadata: Stripe.IMetadata;
  name: string | null;
  object: 'customer';
  phone: string;
  preferred_locales: string[];
  shipping: Stripe.IShippingInformation | null;
  sources: Stripe.IList<Stripe.IStripeSource>;
  subscriptions: Stripe.customers.ICustomerSubscriptions;
  tax_exempt: 'none' | 'exempt' | 'reverse';
  tax_ids: Stripe.IList<Stripe.customerTaxIds.ITaxId>;
  tax_info: any;
  tax_info_verification: any;
}
