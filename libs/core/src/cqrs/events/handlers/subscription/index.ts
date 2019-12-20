import { SubscriptionCreatedHandler } from './subscription-created.handler';
import { SubscriptionCanceledHandler } from './subscription-canceled.handler';
import { SubscriptionChangedHandler } from './subscription-changed.handler';

export const SubscriptionEventHandlers = [
  SubscriptionCreatedHandler,
  SubscriptionCanceledHandler,
  SubscriptionChangedHandler,
];
