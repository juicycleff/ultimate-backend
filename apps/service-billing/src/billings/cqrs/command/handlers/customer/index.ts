import { DeleteStripeCustomerHandler } from './delete-stripe-customer.handler';
import { CreateStripeCustomerHandler } from './create-stripe-customer.handler';
import { UpdateStripeCustomerHandler } from './update-stripe-customer.handler';

export const CustomerCommandHandlers = [
  DeleteStripeCustomerHandler,
  CreateStripeCustomerHandler,
  UpdateStripeCustomerHandler,
];
