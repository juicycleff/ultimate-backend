import { registerEnumType } from '@nestjs/graphql';
import { AppRole, InvitationStatus } from './tenant.enum';
import { ServiceTypes } from './auth.enum';
import { RoleActions } from './roles.enum';
import {
  InvoiceStatus,
  PlanPriceInterval,
  SubscriptionStatus,
} from './billing.enum';
import {
  WebhookApiKeyFieldEnum,
  WebhookCrudEnum,
  WebhookAuthEnum,
  WebhookHttpVerbEnum,
} from './webhook.enum';

export {
  AppRole,
  InvitationStatus,
  InvoiceStatus,
  ServiceTypes,
  PlanPriceInterval,
  SubscriptionStatus,
  WebhookApiKeyFieldEnum,
  WebhookCrudEnum,
  WebhookAuthEnum,
  WebhookHttpVerbEnum,
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

registerEnumType(WebhookHttpVerbEnum, {
  name: 'WebhookHttpVerbEnum',
  description:
    'The name tells it all. All available HTTP verbs for a webhook request',
});

registerEnumType(WebhookAuthEnum, {
  name: 'WebhookAuthEnum',
  description: 'webhook auth types',
});

registerEnumType(WebhookCrudEnum, {
  name: 'WebhookCrudEnum',
  description: 'Webhook filter resource enums',
});

registerEnumType(WebhookApiKeyFieldEnum, {
  name: 'WebhookApiKeyFieldEnum',
  description: 'Webhook filter resource enums',
});
