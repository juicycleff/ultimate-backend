import { Invoice, Plan, TenantSubscription } from './types';
import { cards, ICard, IList, invoices, plans as SPlan, products, subscriptions } from 'stripe';
import { Card, Feature, Price, SubscriptionStatus, InvoiceStatus } from '@ultimatebackend/contracts';

export function convertToPlan(plans: IList<SPlan.IPlan>, product: products.IProduct): Plan {

  if (plans === null || product === null) {
    return null;
  }

  const prices: Price[] = [];
  const features: Feature[] = [];

  if (plans.data && plans.data.length > 0) {
    for (const p of plans.data) {
      prices.push({
        price: p.amount / 100,
        currency: p.currency,
        trialDays: p.trial_period_days,
        id: p.id,
        name: p.nickname,
      });
    }
  }

  if (product.metadata) {
    // tslint:disable-next-line:forin
    for (const k in product.metadata) {
      features.push({
        active: true,
        normalizedName: k,
        name: k,
        description: product.metadata[k],
      });
    }
  }

  const lowestPlan = prices.length > 0 ? prices.reduce(prev => prev.price === 0 && prev) : null;

  // @ts-ignore
  return  {
    id: product.id,
    active: product.active,
    name: product.name,
    normalizedName: product.url,
    createdAt: new Date(product.created),
    updatedAt: new Date(product.updated),
    free: lowestPlan.price === 0,
    prices,
    features,
  };
}

export function convertFromToCard(
  card: cards.ICard | Card | Card[] | cards.ICard[],
): cards.ICard | Card | Card[] | cards.ICard[] {

  if (card === null) {
    return null;
  }

  if (Array.isArray(card)) {
    const result = [];
    for (const c of card) {
      // @ts-ignore
      if (c instanceof Card) {
        const data = {
          address_city: c.address.city,
          address_country: c.address.country,
          address_line1: c.address.line,
          address_line2: c.address.line2,
          address_state: c.address.state,
          address_zip: c.address.postalCode,
          currency: c.currency,
          exp_month: c.expMonth,
          exp_year: c.expYear,
          name: c.name,
          number: c.number,
          default_for_currency: !!c.currency,
          object: 'card',
        } as ICard;
        result.push(data);
      } else {
        const data = {
          address: {
            city: c.address_city,
            postalCode: c.address_zip,
            line: c.address_line1,
            line2: c.address_line2,
            country: c.address_country,
            state: c.address_state,
          },
          name: c.name,
          number: c.number,
          id: c.id,
          currency: c.currency,
          brand: c.brand,
          expMonth: c.exp_month,
          expYear: c.exp_year,
          lastFourDigit: c.last4,
        } as Card;
        result.push(data);
      }
    }

    // @ts-ignore
    return result;
  }

  // @ts-ignore
  if (card instanceof Card) {
    return {
      address_city: card.address.city,
      address_country: card.address.country,
      address_line1: card.address.line,
      address_line2: card.address.line2,
      address_state: card.address.state,
      address_zip: card.address.postalCode,
      currency: card.currency,
      exp_month: card.expMonth,
      exp_year: card.expYear,
      name: card.name,
      number: card.number,
      default_for_currency: !!card.currency,
      object: 'card',
    } as ICard;
  } else if (!Array.isArray(card)) {
    return {
      address: {
        city: card.address_city,
        postalCode: card.address_zip,
        line: card.address_line1,
        line2: card.address_line2,
        country: card.address_country,
        state: card.address_state,
      },
      name: card.name,
      number: card.number,
      id: card.id,
      currency: card.currency,
      brand: card.brand,
      expMonth: card.exp_month,
      expYear: card.exp_year,
      lastFourDigit: card.last4,
    } as Card;
  }

}

export function convertFromToSubscription(
  subscription: subscriptions.ISubscription | TenantSubscription | TenantSubscription[] | subscriptions.ISubscription[],
): subscriptions.ISubscription | TenantSubscription | TenantSubscription[] | subscriptions.ISubscription[] {

  if (subscription === null) {
    return null;
  }

  if (Array.isArray(subscription)) {
    const result = [];
    for (const s of subscription) {
      if (s instanceof TenantSubscription) {
        const status = convertFromSubStatus(s.status);
        // @ts-ignore
        const data = {
          status,
          id: s.id,
          created: s.updatedAt.getDate(),
          cancel_at: s.cancelAt.getDate(),
          canceled_at: s.canceledAt.getDate(),
          metadata: {
            tenantId: s.tenantId,
          },
        } as subscriptions.ISubscription;
        result.push(data);
      } else {
        const status = convertToSubStatus(s.status);

        const data = {
          id: s.id,
          status,
          cancelAt: new Date(s.cancel_at),
          canceledAt: new Date(s.canceled_at),
          createdAt: new Date(s.created),
          updatedAt: new Date(s.created),
          tenantId: s.metadata?.tenantId,
        } as TenantSubscription;
        result.push(data);
      }
    }

    // @ts-ignore
    return result;
  }

  // @ts-ignore
  if (subscription instanceof TenantSubscription) {
    const status = convertFromSubStatus(subscription.status);
    return {
      status: subscription.status,
      id: subscription.id,
      created: subscription.updatedAt.getDate(),
      cancel_at: subscription.cancelAt.getDate(),
      canceled_at: subscription.canceledAt.getDate(),
    } as subscriptions.ISubscription;

  } else if (!Array.isArray(subscription)) {
    const status = convertToSubStatus(subscription.status);

    return {
      id: subscription.id,
      status,
      cancelAt: new Date(subscription.cancel_at),
      canceledAt: new Date(subscription.canceled_at),
      createdAt: new Date(subscription.created),
      updatedAt: new Date(subscription.created),
      tenantId: subscription.metadata?.tenantId,
    } as TenantSubscription;
  }

}

export function convertFromToInvoice(
  subscription: invoices.IInvoice | Invoice | Invoice[] | invoices.IInvoice[],
): invoices.IInvoice | Invoice | Invoice[] | invoices.IInvoice[] {

  if (subscription === null) {
    return null;
  }

  if (Array.isArray(subscription)) {
    const result = [];
    for (const s of subscription) {
      if (s instanceof Invoice) {
        const status = convertFromInvoiceStatus(s.status);

        const data = {
          id: s.id,
          status,
          due_date: s.dueDate.getDate(),
          currency: s.currency,
          account_country: s.accountCountry,
          account_name: s.accountName,
          amount_due: s.amountDue,
          amount_paid: s.amountPaid,
          amount_remaining: s.amountRemaining,
          billing_reason: s.billingReason,
          customer_email: s.customerEmail,
          customer_name: s.customerName,
          description: s.description,
          ending_balance: s.endingBalance,
          hosted_invoice_url: s.hostedInvoiceUrl,
          invoice_pdf: s.invoicePdf,
          number: s.number,
          paid: s.paid,
          receipt_number: s.receiptNumber,
          starting_balance: s.startingBalance,
          statement_descriptor: s.statementDescriptor,
          subtotal: s.subtotal,
          tax: s.tax,
          tax_percent: s.taxPercent,
          total: s.total,
          created: s.createdAt.getDate(),
        } as invoices.IInvoice;
        result.push(data);
      } else {
        const status = convertToInvoiceStatus(s.status);

        const data = {
          id: s.id,
          status,
          dueDate: new Date(s.due_date),
          currency: s.currency,
          accountCountry: s.account_country,
          accountName: s.account_name,
          amountDue: s.amount_due,
          amountPaid: s.amount_paid,
          amountRemaining: s.amount_remaining,
          billingReason: s.billing_reason,
          customerEmail: s.customer_email,
          customerName: s.customer_name,
          description: s.description,
          endingBalance: s.ending_balance,
          hostedInvoiceUrl: s.hosted_invoice_url,
          invoicePdf: s.invoice_pdf,
          number: s.number,
          paid: s.paid,
          receiptNumber: s.receipt_number,
          startingBalance: s.starting_balance,
          statementDescriptor: s.statement_descriptor,
          subtotal: s.subtotal,
          tax: s.tax,
          taxPercent: s.tax_percent,
          total: s.total,
          createdAt: new Date(s.created),
          updatedAt: new Date(s.created),
        } as Invoice;
        result.push(data);
      }
    }

    // @ts-ignore
    return result;
  }

  // @ts-ignore
  if (subscription instanceof Invoice) {
    const status = convertFromInvoiceStatus(subscription.status);

    return {
      id: subscription.id,
      status,
      due_date: subscription.dueDate.getDate(),
      currency: subscription.currency,
      account_country: subscription.accountCountry,
      account_name: subscription.accountName,
      amount_due: subscription.amountDue,
      amount_paid: subscription.amountPaid,
      amount_remaining: subscription.amountRemaining,
      billing_reason: subscription.billingReason,
      customer_email: subscription.customerEmail,
      customer_name: subscription.customerName,
      description: subscription.description,
      ending_balance: subscription.endingBalance,
      hosted_invoice_url: subscription.hostedInvoiceUrl,
      invoice_pdf: subscription.invoicePdf,
      number: subscription.number,
      paid: subscription.paid,
      receipt_number: subscription.receiptNumber,
      starting_balance: subscription.startingBalance,
      statement_descriptor: subscription.statementDescriptor,
      subtotal: subscription.subtotal,
      tax: subscription.tax,
      tax_percent: subscription.taxPercent,
      total: subscription.total,
      created: subscription.createdAt.getDate(),
    } as invoices.IInvoice;

  } else if (!Array.isArray(subscription)) {
    const status = convertToInvoiceStatus(subscription.status);

    return {
      id: subscription.id,
      status,
      dueDate: new Date(subscription.due_date),
      currency: subscription.currency,
      accountCountry: subscription.account_country,
      accountName: subscription.account_name,
      amountDue: subscription.amount_due,
      amountPaid: subscription.amount_paid,
      amountRemaining: subscription.amount_remaining,
      billingReason: subscription.billing_reason,
      customerEmail: subscription.customer_email,
      customerName: subscription.customer_name,
      description: subscription.description,
      endingBalance: subscription.ending_balance,
      hostedInvoiceUrl: subscription.hosted_invoice_url,
      invoicePdf: subscription.invoice_pdf,
      number: subscription.number,
      paid: subscription.paid,
      receiptNumber: subscription.receipt_number,
      startingBalance: subscription.starting_balance,
      statementDescriptor: subscription.statement_descriptor,
      subtotal: subscription.subtotal,
      tax: subscription.tax,
      taxPercent: subscription.tax_percent,
      total: subscription.total,
      createdAt: new Date(subscription.created),
      updatedAt: new Date(subscription.created),
    } as Invoice;
  }
}

function convertFromInvoiceStatus(input: InvoiceStatus) {
  let status;
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

function convertToInvoiceStatus(input: any) {
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

function convertFromSubStatus(input: SubscriptionStatus) {
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

function convertToSubStatus(input: any) {
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
