import { ICard, invoices, plans, subscriptions } from 'stripe';
import {
  Card,
  Invoice,
  InvoiceStatus,
  Plan,
  StripePlan,
  SubscriptionStatus,
  TenantSubscription,
} from '@ultimatebackend/proto-schema/billing';

export function cardToProtoCard(card: ICard, defaultSourceId: string): Card {
  return {
    brand: card.brand,
    currency: card.currency,
    cvc: '',
    expMonth: card.exp_month,
    expYear: card.exp_year,
    id: card.id,
    name: card.name,
    number: card.number,
    lastFourDigit: card.last4,
    isDefault: defaultSourceId === card.id,
    // dynamic_last4: card.dynamic_last4,
    address: {
      city: card.address_city,
      country: card.address_country,
      id: card.id,
      state: card.address_state,
      line: card.address_line1,
      line2: card.address_line2,
      postalCode: card.address_zip,
    },
  };
}

export function cardSliceToProtoCardSlice(
  cardList: ICard[],
  defaultSourceId: string,
): Card[] {
  const tCards: Card[] = [];
  for (const c of cardList) {
    tCards.push(cardToProtoCard(c, defaultSourceId));
  }
  return tCards;
}

export function invoiceToProtoInvoice(invoice: invoices.IInvoice): Invoice {
  return {
    id: invoice.id,
    status: invoice.status,
    dueDate: new Date(invoice.due_date).toISOString(),
    currency: invoice.currency,
    accountCountry: invoice.account_country,
    accountName: invoice.account_name,
    amountDue: invoice.amount_due,
    amountPaid: invoice.amount_paid,
    amountRemaining: invoice.amount_remaining,
    billingReason: invoice.billing_reason,
    customerEmail: invoice.customer_email,
    customerName: invoice.customer_name,
    description: invoice.description,
    endingBalance: invoice.ending_balance,
    hostedInvoiceUrl: invoice.hosted_invoice_url,
    invoicePdf: invoice.invoice_pdf,
    number: invoice.number,
    paid: invoice.paid,
    receiptNumber: invoice.receipt_number,
    startingBalance: invoice.starting_balance,
    statementDescriptor: invoice.statement_descriptor,
    subtotal: invoice.subtotal,
    tax: invoice.tax,
    taxPercent: invoice.tax_percent,
    total: invoice.total,
    createdAt: new Date(invoice.created).toISOString(),
    updatedAt: new Date(invoice.created).toISOString(),
  };
}

export function invoiceSliceToProtoInvoiceSlice(
  invoiceList: invoices.IInvoice[],
): Invoice[] {
  const tInvoice: Invoice[] = [];
  for (const inv of invoiceList) {
    tInvoice.push(invoiceToProtoInvoice(inv));
  }
  return tInvoice;
}

export function planToProtoStripePlan(plan: plans.IPlan): StripePlan {
  return {
    amount: plan.amount,
    currency: plan.currency,
    id: plan.id,
    name: plan.nickname,
    trialDays: plan.trial_period_days,
  };
}

export function planSliceToProtoStripePlanSlice(
  planList: plans.IPlan[],
): StripePlan[] {
  const splans: StripePlan[] = [];
  for (const inv of planList) {
    splans.push(planToProtoStripePlan(inv));
  }
  return splans;
}

export function subsToProtoStripeSubs(
  sub: subscriptions.ISubscription,
): TenantSubscription {
  return {
    createdAt: new Date(sub.created).toISOString(),
    id: sub.id,
    status: sub.status,
    tenantId: sub.metadata.tenantId,
    updatedAt: new Date(sub.created).toISOString(),
    canceledAt: new Date(sub.cancel_at).toISOString(),
    collectionMethod: sub.collection_method,
    currentPeriodEnd: new Date(sub.current_period_end).toISOString(),
    currentPeriodStart: new Date(sub.current_period_start).toISOString(),
    customerEmail: '',
    customerName: '',
    endedAt: new Date(sub.ended_at).toISOString(),
    latestInvoiceId: sub.latest_invoice.toString(),
    startDate: new Date(sub.start_date).toISOString(),
    trialEnd: new Date(sub.trial_end).toISOString(),
    trialStart: new Date(sub.trial_start).toISOString(),
  };
}

export function subsSliceToProtoStripePlanSubs(
  subList: subscriptions.ISubscription[],
): TenantSubscription[] {
  const subs: TenantSubscription[] = [];
  for (const inv of subList) {
    subs.push(subsToProtoStripeSubs(inv));
  }
  return subs;
}

function invoiceStatusToString(input: InvoiceStatus): string {
  let status = null;
  if (input === InvoiceStatus.DRAFT) {
    status = 'draft';
  } else if (input === InvoiceStatus.VOID) {
    status = 'void';
  } else if (input === InvoiceStatus.OPEN) {
    status = 'open';
  } else if (input === InvoiceStatus.PAID) {
    status = 'paid';
  } else if (input === InvoiceStatus.UNCOLLECTIBLE) {
    status = 'uncollectible';
  }
  return status;
}

function stringToInvoiceStatus(input: any): InvoiceStatus {
  let status = InvoiceStatus.DRAFT;
  if (input === 'draft') {
    status = InvoiceStatus.DRAFT;
  } else if (input === 'void') {
    status = InvoiceStatus.VOID;
  } else if (input === 'open') {
    status = InvoiceStatus.OPEN;
  } else if (input === 'paid') {
    status = InvoiceStatus.PAID;
  } else if (input === 'uncollectible') {
    status = InvoiceStatus.UNCOLLECTIBLE;
  }
  return status;
}

function subStatusToSubscription(input: SubscriptionStatus): string {
  let status;
  if (input === SubscriptionStatus.UNPAID) {
    status = 'unpaid';
  } else if (input === SubscriptionStatus.TRIALING) {
    status = 'trialing';
  } else if (input === SubscriptionStatus.PAST_DUE) {
    status = 'past_due';
  } else if (input === SubscriptionStatus.INCOMPLETE_EXPIRED) {
    status = 'incomplete_expired';
  } else if (input === SubscriptionStatus.INCOMPLETE) {
    status = 'incomplete';
  } else if (input === SubscriptionStatus.CANCELED) {
    status = 'canceled';
  } else if (input === SubscriptionStatus.ACTIVE) {
    status = 'active';
  }
  return status;
}

function stringToSubStatus(input: any): SubscriptionStatus {
  let status = SubscriptionStatus.ACTIVE;
  if (input === 'unpaid') {
    status = SubscriptionStatus.UNPAID;
  } else if (input === 'trialing') {
    status = SubscriptionStatus.TRIALING;
  } else if (input === 'past_due') {
    status = SubscriptionStatus.PAST_DUE;
  } else if (input === 'incomplete_expired') {
    status = SubscriptionStatus.INCOMPLETE_EXPIRED;
  } else if (input === 'incomplete') {
    status = SubscriptionStatus.INCOMPLETE;
  } else if (input === 'canceled') {
    status = SubscriptionStatus.CANCELED;
  } else if (input === 'active') {
    status = SubscriptionStatus.ACTIVE;
  }
  return status;
}
