export enum PlanPriceInterval {
  MONTH = 'month',
  YEAR = 'year',
  WEEK = 'week',
  DAY = 'day',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing',
  UNPAID = 'unpaid',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  PAID = 'PAID',
  UNCOLLECTIBLE = 'UNCOLLECTIBLE',
  VOID = 'VOID',
}
