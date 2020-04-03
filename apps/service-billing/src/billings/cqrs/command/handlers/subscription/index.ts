import { CreateSubscriptionHandler } from './create-subscription.handler';
import { CancelSubscriptionHandler } from './cancel-subscription.handler';
import { ChangeSubscriptionHandler } from './change-subscription.handler';

export const SubscriptionCommandHandlers = [
  CreateSubscriptionHandler,
  ChangeSubscriptionHandler,
  CancelSubscriptionHandler,
];
