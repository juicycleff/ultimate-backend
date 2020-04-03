import { registerEnumType } from '@nestjs/graphql';
import { AppRole, InvitationStatus } from './tenant.enum';
import { ServiceTypes } from './auth.enum';
import { RoleActions } from './roles.enum';
import { PointType } from './point.enum';
import { SignalType } from './signal.enum';
import { InvoiceStatus, PlanPriceInterval, SubscriptionStatus } from './billing.enum';

export {
  AppRole,
  InvitationStatus,
  InvoiceStatus,
  ServiceTypes,
  PlanPriceInterval,
  SubscriptionStatus,
  PointType,
  SignalType,
};

registerEnumType(AppRole, {
  name: 'AppRole',
  description: 'The App roles for authorization',
});

registerEnumType(InvitationStatus, {
  name: 'InvitationStatus',
  description: 'The tenant member invitation status',
});

registerEnumType(ServiceTypes, {
  name: 'ServiceTypes',
  description: 'Authentication service types',
});

registerEnumType(RoleActions, {
  name: 'RoleAction',
  description: 'Role action enum types',
});

registerEnumType(PlanPriceInterval, {
  name: 'PlanPriceInterval',
  description: 'Pricing interval enum',
});

registerEnumType(SubscriptionStatus, {
  name: 'SubscriptionStatus',
  description: 'Subscription status enum',
});

registerEnumType(InvoiceStatus, {
  name: 'InvoiceStatus',
  description: 'Invoice status enum',
});

registerEnumType(PointType, {
  name: 'PointType',
  description: 'Point type enum',
});

registerEnumType(SignalType, {
  name: 'SignalType',
  description: 'Signal type enum',
});
