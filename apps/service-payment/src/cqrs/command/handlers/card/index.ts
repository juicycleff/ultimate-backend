import { AddPaymentMethodHandler } from './add-payment-method.handler';
import { RemovePaymentMethodHandler } from './remove-payment-method.handler';
import { UpdatePaymentMethodHandler } from './update-payment-method.handler';

export const CardCommandHandlers = [
  AddPaymentMethodHandler,
  RemovePaymentMethodHandler,
  UpdatePaymentMethodHandler,
];
