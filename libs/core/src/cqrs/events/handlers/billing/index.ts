import { StripeUserCreatedHandler } from './stripe-user-created.handler';
import { StripeUserDeletedHandler } from './stripe-user-deleted.handler';
import { StripeUserUpdatedHandler } from './stripe-user-updated.handler';

export const BillingEventHandlers = [
  StripeUserCreatedHandler,
  StripeUserDeletedHandler,
  StripeUserUpdatedHandler,
];
