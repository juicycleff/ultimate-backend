/* eslint-disable */
import { Observable } from 'rxjs';
import { Writer, Reader } from 'protobufjs/minimal';


export interface TenantSubscription {
  /**
   *  @inject_tag: bson:"_id,omitempty"
   */
  id: string;
  /**
   *  @inject_tag: bson:"tenantId,omitempty"
   */
  tenantId: string;
  /**
   *  @inject_tag: bson:"status,omitempty"
   */
  status: string;
  /**
   *  @inject_tag: bson:"createdAt,omitempty"
   */
  createdAt: string;
  /**
   *  @inject_tag: bson:"updatedAt,omitempty"
   */
  updatedAt: string;
  /**
   *  @inject_tag: bson:"collectionMethod,omitempty"
   */
  collectionMethod: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  endedAt: string;
  canceledAt: string;
  latestInvoiceId: string;
  startDate: string;
  trialStart: string;
  trialEnd: string;
  customerEmail: string;
  customerName: string;
}

export interface Customer {
  /**
   *  @inject_tag: bson:"_id,omitempty"
   */
  id: string;
  /**
   *  @inject_tag: bson:"email,omitempty"
   */
  email: string;
  /**
   *  @inject_tag: bson:"name,omitempty"
   */
  name: string;
}

export interface Address {
  id: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  line: string;
  line2: string;
}

export interface Card {
  id: string;
  name: string;
  cvc: string;
  number: string;
  brand: string;
  currency: string;
  address: Address | undefined;
  expMonth: number;
  expYear: number;
  lastFourDigit: string;
  isDefault: boolean;
}

export interface Price {
  /**
   *  @inject_tag: bson:"name,omitempty"
   */
  name: string;
  /**
   *  @inject_tag: bson:"currency,omitempty"
   */
  currency: string;
  /**
   *  @inject_tag: bson:"id,omitempty"
   */
  id: string;
  /**
   *  @inject_tag: bson:"trialDays,omitempty"
   */
  trialDays: number;
  /**
   *  @inject_tag: bson:"amount,omitempty"
   */
  amount: number;
}

export interface StripePlan {
  /**
   *  @inject_tag: bson:"name,omitempty"
   */
  name: string;
  /**
   *  @inject_tag: bson:"currency,omitempty"
   */
  currency: string;
  /**
   *  @inject_tag: bson:"id,omitempty"
   */
  id: string;
  /**
   *  @inject_tag: bson:"trialDays,omitempty"
   */
  trialDays: number;
  /**
   *  @inject_tag: bson:"amount,omitempty"
   */
  amount: number;
}

export interface Feature {
  /**
   *  @inject_tag: bson:"name,omitempty"
   */
  name: string;
  /**
   *  @inject_tag: bson:"normalizedName,omitempty"
   */
  normalizedName: string;
  /**
   *  @inject_tag: bson:"description,omitempty"
   */
  description: string;
  /**
   *  @inject_tag: bson:"min,omitempty"
   */
  min: number;
  /**
   *  @inject_tag: bson:"max,omitempty"
   */
  max: number;
  /**
   *  @inject_tag: bson:"active,omitempty"
   */
  active: boolean;
  /**
   *  @inject_tag: bson:"full,omitempty"
   */
  full: boolean;
  /**
   *  @inject_tag: bson:"full,omitempty"
   */
  unit: string;
}

export interface Plan {
  /**
   *  @inject_tag: bson:"_id,omitempty"
   */
  id: string;
  /**
   *  @inject_tag: bson:"normalizedName,omitempty"
   */
  normalizedName: string;
  /**
   *  @inject_tag: bson:"prices,omitempty"
   */
  price: Price | undefined;
  /**
   *  @inject_tag: bson:"features,omitempty"
   */
  features: Feature[];
  /**
   *  @inject_tag: bson:"active,omitempty"
   */
  active: boolean;
  /**
   *  @inject_tag: bson:"free,omitempty"
   */
  free: boolean;
  /**
   *  @inject_tag: bson:"createdAt,omitempty"
   */
  createdAt: string;
  /**
   *  @inject_tag: bson:"updatedAt,omitempty"
   */
  updatedAt: string;
  /**
   *  @inject_tag: bson:"name,omitempty"
   */
  name: string;
  /**
   *  @inject_tag: bson:"stripeId,omitempty"
   */
  stripeId: string;
}

export interface Invoice {
  /**
   *  @inject_tag: bson:"id,omitempty"
   */
  id: string;
  accountCountry: string;
  accountName: string;
  amountDue: number;
  amountPaid: number;
  amountRemaining: number;
  billingReason: string;
  currency: string;
  customerEmail: string;
  customerName: string;
  description: string;
  dueDate: string;
  endingBalance: number;
  hostedInvoiceUrl: string;
  invoicePdf: string;
  number: string;
  paid: boolean;
  receiptNumber: string;
  startingBalance: number;
  statementDescriptor: string;
  status: string;
  subtotal: number;
  tax: number;
  taxPercent: number;
  total: number;
  /**
   *  @inject_tag: bson:"createdAt,omitempty"
   */
  createdAt: string;
  /**
   *  @inject_tag: bson:"updatedAt,omitempty"
   */
  updatedAt: string;
}

export interface CreatePriceRequest {
  price: number;
  currency: string;
  id: string;
  nickname: string;
  trialDays: number;
  intervalCount: number;
  interval: string;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  prices: CreatePriceRequest[];
  features: Feature[];
  active: boolean;
  free: boolean;
}

export interface CreatePlanResponse {
  plan: Plan | undefined;
}

export interface ReadPlanRequest {
  id: string;
}

export interface ReadPlanResponse {
  plan: Plan | undefined;
}

export interface FindPlansRequest {
}

export interface FindPlansResponse {
  plans: Plan[];
}

export interface ReadStripePlanRequest {
  id: string;
}

export interface ReadStripePlanResponse {
  plan: StripePlan | undefined;
}

export interface FindStripePlansRequest {
  productId: string;
}

export interface FindStripePlansResponse {
  plans: StripePlan[];
}

export interface ReadInvoiceRequest {
  id: string;
}

export interface ReadInvoiceResponse {
  invoice: Invoice | undefined;
}

export interface FindInvoicesRequest {
}

export interface FindInvoicesResponse {
  invoices: Invoice[];
}

/**
 *  Subscription
 */
export interface CreateSubscriptionRequest {
  customerId: string;
  tenantId: string;
  planId: string;
  couponId: string;
  cardId: string;
}

export interface CreateSubscriptionResponse {
  subscription: TenantSubscription | undefined;
}

export interface ChangeSubscriptionRequest {
  customerId: string;
  tenantId: string;
  planId: string;
  couponId: string;
}

export interface ChangeSubscriptionResponse {
  subscription: TenantSubscription | undefined;
}

export interface CancelSubscriptionRequest {
  customerId: string;
  tenantId: string;
}

export interface CancelSubscriptionResponse {
  subscription: TenantSubscription | undefined;
}

export interface ReadSubscriptionRequest {
  id: string;
  tenantId: string;
}

export interface ReadSubscriptionResponse {
  subscription: TenantSubscription | undefined;
}

export interface FindSubscriptionsRequest {
  tenantId: string;
}

export interface FindSubscriptionsResponse {
  subscriptions: TenantSubscription[];
}

/**
 *  Cards
 */
export interface CreateCardRequest {
  name: string;
  cvc: string;
  number: string;
  currency: string;
  expMonth: string;
  expYear: string;
  address: Address | undefined;
}

export interface CreateCardResponse {
  card: Card | undefined;
}

export interface SetDefaultCardRequest {
  id: string;
}

export interface SetDefaultCardResponse {
  card: Card | undefined;
}

export interface DeleteCardRequest {
  id: string;
}

export interface DeleteCardResponse {
  card: Card | undefined;
}

export interface ReadCardRequest {
  id: string;
}

export interface ReadCardResponse {
  card: Card | undefined;
}

export interface FindCardsRequest {
}

export interface FindCardsResponse {
  cards: Card[];
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  number: string;
  currency: string;
}

export interface CreateCustomerResponse {
  customer: Customer | undefined;
}

export interface DeleteCustomerRequest {
  id: string;
}

export interface DeleteCustomerResponse {
  customer: Customer | undefined;
}

export interface ReadCustomerRequest {
  id: string;
}

export interface ReadCustomerResponse {
  customer: Customer | undefined;
}

export interface Message {
  say: string;
}

export interface Event {
  /**
   *  unique id
   */
  id: string;
  /**
   *  unix timestamp
   */
  timestamp: number;
  /**
   *  message
   */
  message: string;
  /**
   *  message
   */
  topic: string;
}

const baseTenantSubscription: object = {
  id: '',
  tenantId: '',
  status: '',
  createdAt: '',
  updatedAt: '',
  collectionMethod: '',
  currentPeriodStart: '',
  currentPeriodEnd: '',
  endedAt: '',
  canceledAt: '',
  latestInvoiceId: '',
  startDate: '',
  trialStart: '',
  trialEnd: '',
  customerEmail: '',
  customerName: '',
};

const baseCustomer: object = {
  id: '',
  email: '',
  name: '',
};

const baseAddress: object = {
  id: '',
  country: '',
  state: '',
  city: '',
  postalCode: '',
  line: '',
  line2: '',
};

const baseCard: object = {
  id: '',
  name: '',
  cvc: '',
  number: '',
  brand: '',
  currency: '',
  address: undefined,
  expMonth: 0,
  expYear: 0,
  lastFourDigit: '',
  isDefault: false,
};

const basePrice: object = {
  name: '',
  currency: '',
  id: '',
  trialDays: 0,
  amount: 0,
};

const baseStripePlan: object = {
  name: '',
  currency: '',
  id: '',
  trialDays: 0,
  amount: 0,
};

const baseFeature: object = {
  name: '',
  normalizedName: '',
  description: '',
  min: 0,
  max: 0,
  active: false,
  full: false,
  unit: '',
};

const basePlan: object = {
  id: '',
  normalizedName: '',
  price: undefined,
  features: undefined,
  active: false,
  free: false,
  createdAt: '',
  updatedAt: '',
  name: '',
  stripeId: '',
};

const baseInvoice: object = {
  id: '',
  accountCountry: '',
  accountName: '',
  amountDue: 0,
  amountPaid: 0,
  amountRemaining: 0,
  billingReason: '',
  currency: '',
  customerEmail: '',
  customerName: '',
  description: '',
  dueDate: '',
  endingBalance: 0,
  hostedInvoiceUrl: '',
  invoicePdf: '',
  number: '',
  paid: false,
  receiptNumber: '',
  startingBalance: 0,
  statementDescriptor: '',
  status: '',
  subtotal: 0,
  tax: 0,
  taxPercent: 0,
  total: 0,
  createdAt: '',
  updatedAt: '',
};

const baseCreatePriceRequest: object = {
  price: 0,
  currency: '',
  id: '',
  nickname: '',
  trialDays: 0,
  intervalCount: 0,
  interval: '',
};

const baseCreatePlanRequest: object = {
  name: '',
  description: '',
  prices: undefined,
  features: undefined,
  active: false,
  free: false,
};

const baseCreatePlanResponse: object = {
  plan: undefined,
};

const baseReadPlanRequest: object = {
  id: '',
};

const baseReadPlanResponse: object = {
  plan: undefined,
};

const baseFindPlansRequest: object = {
};

const baseFindPlansResponse: object = {
  plans: undefined,
};

const baseReadStripePlanRequest: object = {
  id: '',
};

const baseReadStripePlanResponse: object = {
  plan: undefined,
};

const baseFindStripePlansRequest: object = {
  productId: '',
};

const baseFindStripePlansResponse: object = {
  plans: undefined,
};

const baseReadInvoiceRequest: object = {
  id: '',
};

const baseReadInvoiceResponse: object = {
  invoice: undefined,
};

const baseFindInvoicesRequest: object = {
};

const baseFindInvoicesResponse: object = {
  invoices: undefined,
};

const baseCreateSubscriptionRequest: object = {
  customerId: '',
  tenantId: '',
  planId: '',
  couponId: '',
  cardId: '',
};

const baseCreateSubscriptionResponse: object = {
  subscription: undefined,
};

const baseChangeSubscriptionRequest: object = {
  customerId: '',
  tenantId: '',
  planId: '',
  couponId: '',
};

const baseChangeSubscriptionResponse: object = {
  subscription: undefined,
};

const baseCancelSubscriptionRequest: object = {
  customerId: '',
  tenantId: '',
};

const baseCancelSubscriptionResponse: object = {
  subscription: undefined,
};

const baseReadSubscriptionRequest: object = {
  id: '',
  tenantId: '',
};

const baseReadSubscriptionResponse: object = {
  subscription: undefined,
};

const baseFindSubscriptionsRequest: object = {
  tenantId: '',
};

const baseFindSubscriptionsResponse: object = {
  subscriptions: undefined,
};

const baseCreateCardRequest: object = {
  name: '',
  cvc: '',
  number: '',
  currency: '',
  expMonth: '',
  expYear: '',
  address: undefined,
};

const baseCreateCardResponse: object = {
  card: undefined,
};

const baseSetDefaultCardRequest: object = {
  id: '',
};

const baseSetDefaultCardResponse: object = {
  card: undefined,
};

const baseDeleteCardRequest: object = {
  id: '',
};

const baseDeleteCardResponse: object = {
  card: undefined,
};

const baseReadCardRequest: object = {
  id: '',
};

const baseReadCardResponse: object = {
  card: undefined,
};

const baseFindCardsRequest: object = {
};

const baseFindCardsResponse: object = {
  cards: undefined,
};

const baseCreateCustomerRequest: object = {
  name: '',
  email: '',
  number: '',
  currency: '',
};

const baseCreateCustomerResponse: object = {
  customer: undefined,
};

const baseDeleteCustomerRequest: object = {
  id: '',
};

const baseDeleteCustomerResponse: object = {
  customer: undefined,
};

const baseReadCustomerRequest: object = {
  id: '',
};

const baseReadCustomerResponse: object = {
  customer: undefined,
};

const baseMessage: object = {
  say: '',
};

const baseEvent: object = {
  id: '',
  timestamp: 0,
  message: '',
  topic: '',
};

export interface BillingService<Context extends DataLoaders> {

  createCustomer(request: CreateCustomerRequest, ctx: Context): Promise<CreateCustomerResponse>;

  deleteCustomer(request: DeleteCustomerRequest, ctx: Context): Promise<DeleteCustomerResponse>;

  readCustomer(request: ReadCustomerRequest, ctx: Context): Promise<ReadCustomerResponse>;

  createPlan(request: CreatePlanRequest, ctx: Context): Promise<CreatePlanResponse>;

  readPlan(request: ReadPlanRequest, ctx: Context): Promise<ReadPlanResponse>;

  findPlans(request: FindPlansRequest, ctx: Context): Promise<FindPlansResponse>;

  readStripePlan(request: ReadStripePlanRequest, ctx: Context): Promise<ReadStripePlanResponse>;

  findStripePlans(request: FindStripePlansRequest, ctx: Context): Promise<FindStripePlansResponse>;

  createCard(request: CreateCardRequest, ctx: Context): Promise<CreateCardResponse>;

  deleteCard(request: DeleteCardRequest, ctx: Context): Promise<DeleteCardResponse>;

  setDefaultCard(request: SetDefaultCardRequest, ctx: Context): Promise<SetDefaultCardResponse>;

  readCard(request: ReadCardRequest, ctx: Context): Promise<ReadCardResponse>;

  findCards(request: FindCardsRequest, ctx: Context): Promise<FindCardsResponse>;

  createSubscription(request: CreateSubscriptionRequest, ctx: Context): Promise<CreateSubscriptionResponse>;

  cancelSubscription(request: CancelSubscriptionRequest, ctx: Context): Promise<CancelSubscriptionResponse>;

  changeSubscription(request: ChangeSubscriptionRequest, ctx: Context): Promise<ChangeSubscriptionResponse>;

  readSubscription(request: ReadSubscriptionRequest, ctx: Context): Promise<ReadSubscriptionResponse>;

  findSubscriptions(request: FindSubscriptionsRequest, ctx: Context): Promise<FindSubscriptionsResponse>;

  readInvoice(request: ReadInvoiceRequest, ctx: Context): Promise<ReadInvoiceResponse>;

  findInvoices(request: FindInvoicesRequest, ctx: Context): Promise<FindInvoicesResponse>;

}

export interface BillingServiceClient<Context extends DataLoaders> {

  createCustomer(request: CreateCustomerRequest, ctx?: Context): Observable<CreateCustomerResponse>;

  deleteCustomer(request: DeleteCustomerRequest, ctx?: Context): Observable<DeleteCustomerResponse>;

  readCustomer(request: ReadCustomerRequest, ctx?: Context): Observable<ReadCustomerResponse>;

  createPlan(request: CreatePlanRequest, ctx?: Context): Observable<CreatePlanResponse>;

  readPlan(request: ReadPlanRequest, ctx?: Context): Observable<ReadPlanResponse>;

  findPlans(request: FindPlansRequest, ctx?: Context): Observable<FindPlansResponse>;

  readStripePlan(request: ReadStripePlanRequest, ctx?: Context): Observable<ReadStripePlanResponse>;

  findStripePlans(request: FindStripePlansRequest, ctx?: Context): Observable<FindStripePlansResponse>;

  createCard(request: CreateCardRequest, ctx?: Context): Observable<CreateCardResponse>;

  deleteCard(request: DeleteCardRequest, ctx?: Context): Observable<DeleteCardResponse>;

  setDefaultCard(request: SetDefaultCardRequest, ctx?: Context): Observable<SetDefaultCardResponse>;

  readCard(request: ReadCardRequest, ctx?: Context): Observable<ReadCardResponse>;

  findCards(request: FindCardsRequest, ctx?: Context): Observable<FindCardsResponse>;

  createSubscription(request: CreateSubscriptionRequest, ctx?: Context): Observable<CreateSubscriptionResponse>;

  cancelSubscription(request: CancelSubscriptionRequest, ctx?: Context): Observable<CancelSubscriptionResponse>;

  changeSubscription(request: ChangeSubscriptionRequest, ctx?: Context): Observable<ChangeSubscriptionResponse>;

  readSubscription(request: ReadSubscriptionRequest, ctx?: Context): Observable<ReadSubscriptionResponse>;

  findSubscriptions(request: FindSubscriptionsRequest, ctx?: Context): Observable<FindSubscriptionsResponse>;

  readInvoice(request: ReadInvoiceRequest, ctx?: Context): Observable<ReadInvoiceResponse>;

  findInvoices(request: FindInvoicesRequest, ctx?: Context): Observable<FindInvoicesResponse>;

}

interface DataLoaders {

  getDataLoader<T>(identifier: string, constructorFn: () => T): T;

}

export const PlanPriceInterval = {
  MONTH: 0 as PlanPriceInterval,
  YEAR: 1 as PlanPriceInterval,
  WEEK: 2 as PlanPriceInterval,
  DAY: 3 as PlanPriceInterval,
  fromJSON(object: any): PlanPriceInterval {
    switch (object) {
      case 0:
      case "MONTH":
        return PlanPriceInterval.MONTH;
      case 1:
      case "YEAR":
        return PlanPriceInterval.YEAR;
      case 2:
      case "WEEK":
        return PlanPriceInterval.WEEK;
      case 3:
      case "DAY":
        return PlanPriceInterval.DAY;
      default:
        throw new global.Error(`Invalid value ${object}`);
    }
  },
  toJSON(object: PlanPriceInterval): string {
    switch (object) {
      case PlanPriceInterval.MONTH:
        return "MONTH";
      case PlanPriceInterval.YEAR:
        return "YEAR";
      case PlanPriceInterval.WEEK:
        return "WEEK";
      case PlanPriceInterval.DAY:
        return "DAY";
      default:
        return "UNKNOWN";
    }
  },
}

export type PlanPriceInterval = 0 | 1 | 2 | 3;

export const InvoiceStatus = {
  DRAFT: 0 as InvoiceStatus,
  OPEN: 1 as InvoiceStatus,
  PAID: 2 as InvoiceStatus,
  UNCOLLECTIBLE: 3 as InvoiceStatus,
  VOID: 4 as InvoiceStatus,
  fromJSON(object: any): InvoiceStatus {
    switch (object) {
      case 0:
      case "DRAFT":
        return InvoiceStatus.DRAFT;
      case 1:
      case "OPEN":
        return InvoiceStatus.OPEN;
      case 2:
      case "PAID":
        return InvoiceStatus.PAID;
      case 3:
      case "UNCOLLECTIBLE":
        return InvoiceStatus.UNCOLLECTIBLE;
      case 4:
      case "VOID":
        return InvoiceStatus.VOID;
      default:
        throw new global.Error(`Invalid value ${object}`);
    }
  },
  toJSON(object: InvoiceStatus): string {
    switch (object) {
      case InvoiceStatus.DRAFT:
        return "DRAFT";
      case InvoiceStatus.OPEN:
        return "OPEN";
      case InvoiceStatus.PAID:
        return "PAID";
      case InvoiceStatus.UNCOLLECTIBLE:
        return "UNCOLLECTIBLE";
      case InvoiceStatus.VOID:
        return "VOID";
      default:
        return "UNKNOWN";
    }
  },
}

export type InvoiceStatus = 0 | 1 | 2 | 3 | 4;

export const SubscriptionStatus = {
  ACTIVE: 0 as SubscriptionStatus,
  ALL: 1 as SubscriptionStatus,
  CANCELED: 2 as SubscriptionStatus,
  INCOMPLETE: 3 as SubscriptionStatus,
  INCOMPLETE_EXPIRED: 4 as SubscriptionStatus,
  PAST_DUE: 5 as SubscriptionStatus,
  TRIALING: 6 as SubscriptionStatus,
  UNPAID: 7 as SubscriptionStatus,
  fromJSON(object: any): SubscriptionStatus {
    switch (object) {
      case 0:
      case "ACTIVE":
        return SubscriptionStatus.ACTIVE;
      case 1:
      case "ALL":
        return SubscriptionStatus.ALL;
      case 2:
      case "CANCELED":
        return SubscriptionStatus.CANCELED;
      case 3:
      case "INCOMPLETE":
        return SubscriptionStatus.INCOMPLETE;
      case 4:
      case "INCOMPLETE_EXPIRED":
        return SubscriptionStatus.INCOMPLETE_EXPIRED;
      case 5:
      case "PAST_DUE":
        return SubscriptionStatus.PAST_DUE;
      case 6:
      case "TRIALING":
        return SubscriptionStatus.TRIALING;
      case 7:
      case "UNPAID":
        return SubscriptionStatus.UNPAID;
      default:
        throw new global.Error(`Invalid value ${object}`);
    }
  },
  toJSON(object: SubscriptionStatus): string {
    switch (object) {
      case SubscriptionStatus.ACTIVE:
        return "ACTIVE";
      case SubscriptionStatus.ALL:
        return "ALL";
      case SubscriptionStatus.CANCELED:
        return "CANCELED";
      case SubscriptionStatus.INCOMPLETE:
        return "INCOMPLETE";
      case SubscriptionStatus.INCOMPLETE_EXPIRED:
        return "INCOMPLETE_EXPIRED";
      case SubscriptionStatus.PAST_DUE:
        return "PAST_DUE";
      case SubscriptionStatus.TRIALING:
        return "TRIALING";
      case SubscriptionStatus.UNPAID:
        return "UNPAID";
      default:
        return "UNKNOWN";
    }
  },
}

export type SubscriptionStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const TenantSubscription = {
  encode(message: TenantSubscription, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.tenantId);
    writer.uint32(26).string(message.status);
    writer.uint32(50).string(message.createdAt);
    writer.uint32(58).string(message.updatedAt);
    writer.uint32(66).string(message.collectionMethod);
    writer.uint32(74).string(message.currentPeriodStart);
    writer.uint32(82).string(message.currentPeriodEnd);
    writer.uint32(90).string(message.endedAt);
    writer.uint32(98).string(message.canceledAt);
    writer.uint32(106).string(message.latestInvoiceId);
    writer.uint32(114).string(message.startDate);
    writer.uint32(122).string(message.trialStart);
    writer.uint32(130).string(message.trialEnd);
    writer.uint32(138).string(message.customerEmail);
    writer.uint32(146).string(message.customerName);
    return writer;
  },
  decode(reader: Reader, length?: number): TenantSubscription {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseTenantSubscription) as TenantSubscription;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.tenantId = reader.string();
          break;
        case 3:
          message.status = reader.string();
          break;
        case 6:
          message.createdAt = reader.string();
          break;
        case 7:
          message.updatedAt = reader.string();
          break;
        case 8:
          message.collectionMethod = reader.string();
          break;
        case 9:
          message.currentPeriodStart = reader.string();
          break;
        case 10:
          message.currentPeriodEnd = reader.string();
          break;
        case 11:
          message.endedAt = reader.string();
          break;
        case 12:
          message.canceledAt = reader.string();
          break;
        case 13:
          message.latestInvoiceId = reader.string();
          break;
        case 14:
          message.startDate = reader.string();
          break;
        case 15:
          message.trialStart = reader.string();
          break;
        case 16:
          message.trialEnd = reader.string();
          break;
        case 17:
          message.customerEmail = reader.string();
          break;
        case 18:
          message.customerName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): TenantSubscription {
    const message = Object.create(baseTenantSubscription) as TenantSubscription;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = String(object.status);
    } else {
      message.status = '';
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = String(object.createdAt);
    } else {
      message.createdAt = '';
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = String(object.updatedAt);
    } else {
      message.updatedAt = '';
    }
    if (object.collectionMethod !== undefined && object.collectionMethod !== null) {
      message.collectionMethod = String(object.collectionMethod);
    } else {
      message.collectionMethod = '';
    }
    if (object.currentPeriodStart !== undefined && object.currentPeriodStart !== null) {
      message.currentPeriodStart = String(object.currentPeriodStart);
    } else {
      message.currentPeriodStart = '';
    }
    if (object.currentPeriodEnd !== undefined && object.currentPeriodEnd !== null) {
      message.currentPeriodEnd = String(object.currentPeriodEnd);
    } else {
      message.currentPeriodEnd = '';
    }
    if (object.endedAt !== undefined && object.endedAt !== null) {
      message.endedAt = String(object.endedAt);
    } else {
      message.endedAt = '';
    }
    if (object.canceledAt !== undefined && object.canceledAt !== null) {
      message.canceledAt = String(object.canceledAt);
    } else {
      message.canceledAt = '';
    }
    if (object.latestInvoiceId !== undefined && object.latestInvoiceId !== null) {
      message.latestInvoiceId = String(object.latestInvoiceId);
    } else {
      message.latestInvoiceId = '';
    }
    if (object.startDate !== undefined && object.startDate !== null) {
      message.startDate = String(object.startDate);
    } else {
      message.startDate = '';
    }
    if (object.trialStart !== undefined && object.trialStart !== null) {
      message.trialStart = String(object.trialStart);
    } else {
      message.trialStart = '';
    }
    if (object.trialEnd !== undefined && object.trialEnd !== null) {
      message.trialEnd = String(object.trialEnd);
    } else {
      message.trialEnd = '';
    }
    if (object.customerEmail !== undefined && object.customerEmail !== null) {
      message.customerEmail = String(object.customerEmail);
    } else {
      message.customerEmail = '';
    }
    if (object.customerName !== undefined && object.customerName !== null) {
      message.customerName = String(object.customerName);
    } else {
      message.customerName = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<TenantSubscription>): TenantSubscription {
    const message = Object.create(baseTenantSubscription) as TenantSubscription;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = object.status;
    } else {
      message.status = '';
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = object.createdAt;
    } else {
      message.createdAt = '';
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = object.updatedAt;
    } else {
      message.updatedAt = '';
    }
    if (object.collectionMethod !== undefined && object.collectionMethod !== null) {
      message.collectionMethod = object.collectionMethod;
    } else {
      message.collectionMethod = '';
    }
    if (object.currentPeriodStart !== undefined && object.currentPeriodStart !== null) {
      message.currentPeriodStart = object.currentPeriodStart;
    } else {
      message.currentPeriodStart = '';
    }
    if (object.currentPeriodEnd !== undefined && object.currentPeriodEnd !== null) {
      message.currentPeriodEnd = object.currentPeriodEnd;
    } else {
      message.currentPeriodEnd = '';
    }
    if (object.endedAt !== undefined && object.endedAt !== null) {
      message.endedAt = object.endedAt;
    } else {
      message.endedAt = '';
    }
    if (object.canceledAt !== undefined && object.canceledAt !== null) {
      message.canceledAt = object.canceledAt;
    } else {
      message.canceledAt = '';
    }
    if (object.latestInvoiceId !== undefined && object.latestInvoiceId !== null) {
      message.latestInvoiceId = object.latestInvoiceId;
    } else {
      message.latestInvoiceId = '';
    }
    if (object.startDate !== undefined && object.startDate !== null) {
      message.startDate = object.startDate;
    } else {
      message.startDate = '';
    }
    if (object.trialStart !== undefined && object.trialStart !== null) {
      message.trialStart = object.trialStart;
    } else {
      message.trialStart = '';
    }
    if (object.trialEnd !== undefined && object.trialEnd !== null) {
      message.trialEnd = object.trialEnd;
    } else {
      message.trialEnd = '';
    }
    if (object.customerEmail !== undefined && object.customerEmail !== null) {
      message.customerEmail = object.customerEmail;
    } else {
      message.customerEmail = '';
    }
    if (object.customerName !== undefined && object.customerName !== null) {
      message.customerName = object.customerName;
    } else {
      message.customerName = '';
    }
    return message;
  },
  toJSON(message: TenantSubscription): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.tenantId = message.tenantId || '';
    obj.status = message.status || '';
    obj.createdAt = message.createdAt || '';
    obj.updatedAt = message.updatedAt || '';
    obj.collectionMethod = message.collectionMethod || '';
    obj.currentPeriodStart = message.currentPeriodStart || '';
    obj.currentPeriodEnd = message.currentPeriodEnd || '';
    obj.endedAt = message.endedAt || '';
    obj.canceledAt = message.canceledAt || '';
    obj.latestInvoiceId = message.latestInvoiceId || '';
    obj.startDate = message.startDate || '';
    obj.trialStart = message.trialStart || '';
    obj.trialEnd = message.trialEnd || '';
    obj.customerEmail = message.customerEmail || '';
    obj.customerName = message.customerName || '';
    return obj;
  },
};

export const Customer = {
  encode(message: Customer, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(34).string(message.email);
    writer.uint32(42).string(message.name);
    return writer;
  },
  decode(reader: Reader, length?: number): Customer {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCustomer) as Customer;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 4:
          message.email = reader.string();
          break;
        case 5:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Customer {
    const message = Object.create(baseCustomer) as Customer;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    } else {
      message.email = '';
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Customer>): Customer {
    const message = Object.create(baseCustomer) as Customer;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    } else {
      message.email = '';
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    return message;
  },
  toJSON(message: Customer): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.email = message.email || '';
    obj.name = message.name || '';
    return obj;
  },
};

export const Address = {
  encode(message: Address, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.country);
    writer.uint32(26).string(message.state);
    writer.uint32(34).string(message.city);
    writer.uint32(42).string(message.postalCode);
    writer.uint32(50).string(message.line);
    writer.uint32(58).string(message.line2);
    return writer;
  },
  decode(reader: Reader, length?: number): Address {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseAddress) as Address;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.country = reader.string();
          break;
        case 3:
          message.state = reader.string();
          break;
        case 4:
          message.city = reader.string();
          break;
        case 5:
          message.postalCode = reader.string();
          break;
        case 6:
          message.line = reader.string();
          break;
        case 7:
          message.line2 = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Address {
    const message = Object.create(baseAddress) as Address;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.country !== undefined && object.country !== null) {
      message.country = String(object.country);
    } else {
      message.country = '';
    }
    if (object.state !== undefined && object.state !== null) {
      message.state = String(object.state);
    } else {
      message.state = '';
    }
    if (object.city !== undefined && object.city !== null) {
      message.city = String(object.city);
    } else {
      message.city = '';
    }
    if (object.postalCode !== undefined && object.postalCode !== null) {
      message.postalCode = String(object.postalCode);
    } else {
      message.postalCode = '';
    }
    if (object.line !== undefined && object.line !== null) {
      message.line = String(object.line);
    } else {
      message.line = '';
    }
    if (object.line2 !== undefined && object.line2 !== null) {
      message.line2 = String(object.line2);
    } else {
      message.line2 = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Address>): Address {
    const message = Object.create(baseAddress) as Address;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.country !== undefined && object.country !== null) {
      message.country = object.country;
    } else {
      message.country = '';
    }
    if (object.state !== undefined && object.state !== null) {
      message.state = object.state;
    } else {
      message.state = '';
    }
    if (object.city !== undefined && object.city !== null) {
      message.city = object.city;
    } else {
      message.city = '';
    }
    if (object.postalCode !== undefined && object.postalCode !== null) {
      message.postalCode = object.postalCode;
    } else {
      message.postalCode = '';
    }
    if (object.line !== undefined && object.line !== null) {
      message.line = object.line;
    } else {
      message.line = '';
    }
    if (object.line2 !== undefined && object.line2 !== null) {
      message.line2 = object.line2;
    } else {
      message.line2 = '';
    }
    return message;
  },
  toJSON(message: Address): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.country = message.country || '';
    obj.state = message.state || '';
    obj.city = message.city || '';
    obj.postalCode = message.postalCode || '';
    obj.line = message.line || '';
    obj.line2 = message.line2 || '';
    return obj;
  },
};

export const Card = {
  encode(message: Card, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.name);
    writer.uint32(26).string(message.cvc);
    writer.uint32(34).string(message.number);
    writer.uint32(42).string(message.brand);
    writer.uint32(50).string(message.currency);
    if (message.address !== undefined && message.address !== undefined) {
      Address.encode(message.address, writer.uint32(58).fork()).ldelim();
    }
    writer.uint32(64).uint32(message.expMonth);
    writer.uint32(72).uint32(message.expYear);
    writer.uint32(82).string(message.lastFourDigit);
    writer.uint32(88).bool(message.isDefault);
    return writer;
  },
  decode(reader: Reader, length?: number): Card {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCard) as Card;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.cvc = reader.string();
          break;
        case 4:
          message.number = reader.string();
          break;
        case 5:
          message.brand = reader.string();
          break;
        case 6:
          message.currency = reader.string();
          break;
        case 7:
          message.address = Address.decode(reader, reader.uint32());
          break;
        case 8:
          message.expMonth = reader.uint32();
          break;
        case 9:
          message.expYear = reader.uint32();
          break;
        case 10:
          message.lastFourDigit = reader.string();
          break;
        case 11:
          message.isDefault = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Card {
    const message = Object.create(baseCard) as Card;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.cvc !== undefined && object.cvc !== null) {
      message.cvc = String(object.cvc);
    } else {
      message.cvc = '';
    }
    if (object.number !== undefined && object.number !== null) {
      message.number = String(object.number);
    } else {
      message.number = '';
    }
    if (object.brand !== undefined && object.brand !== null) {
      message.brand = String(object.brand);
    } else {
      message.brand = '';
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = String(object.currency);
    } else {
      message.currency = '';
    }
    if (object.address !== undefined && object.address !== null) {
      message.address = Address.fromJSON(object.address);
    } else {
      message.address = undefined;
    }
    if (object.expMonth !== undefined && object.expMonth !== null) {
      message.expMonth = Number(object.expMonth);
    } else {
      message.expMonth = 0;
    }
    if (object.expYear !== undefined && object.expYear !== null) {
      message.expYear = Number(object.expYear);
    } else {
      message.expYear = 0;
    }
    if (object.lastFourDigit !== undefined && object.lastFourDigit !== null) {
      message.lastFourDigit = String(object.lastFourDigit);
    } else {
      message.lastFourDigit = '';
    }
    if (object.isDefault !== undefined && object.isDefault !== null) {
      message.isDefault = Boolean(object.isDefault);
    } else {
      message.isDefault = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<Card>): Card {
    const message = Object.create(baseCard) as Card;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.cvc !== undefined && object.cvc !== null) {
      message.cvc = object.cvc;
    } else {
      message.cvc = '';
    }
    if (object.number !== undefined && object.number !== null) {
      message.number = object.number;
    } else {
      message.number = '';
    }
    if (object.brand !== undefined && object.brand !== null) {
      message.brand = object.brand;
    } else {
      message.brand = '';
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = object.currency;
    } else {
      message.currency = '';
    }
    if (object.address !== undefined && object.address !== null) {
      message.address = Address.fromPartial(object.address);
    } else {
      message.address = undefined;
    }
    if (object.expMonth !== undefined && object.expMonth !== null) {
      message.expMonth = object.expMonth;
    } else {
      message.expMonth = 0;
    }
    if (object.expYear !== undefined && object.expYear !== null) {
      message.expYear = object.expYear;
    } else {
      message.expYear = 0;
    }
    if (object.lastFourDigit !== undefined && object.lastFourDigit !== null) {
      message.lastFourDigit = object.lastFourDigit;
    } else {
      message.lastFourDigit = '';
    }
    if (object.isDefault !== undefined && object.isDefault !== null) {
      message.isDefault = object.isDefault;
    } else {
      message.isDefault = false;
    }
    return message;
  },
  toJSON(message: Card): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.name = message.name || '';
    obj.cvc = message.cvc || '';
    obj.number = message.number || '';
    obj.brand = message.brand || '';
    obj.currency = message.currency || '';
    obj.address = message.address ? Address.toJSON(message.address) : undefined;
    obj.expMonth = message.expMonth || 0;
    obj.expYear = message.expYear || 0;
    obj.lastFourDigit = message.lastFourDigit || '';
    obj.isDefault = message.isDefault || false;
    return obj;
  },
};

export const Price = {
  encode(message: Price, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(18).string(message.currency);
    writer.uint32(26).string(message.id);
    writer.uint32(32).int32(message.trialDays);
    writer.uint32(45).float(message.amount);
    return writer;
  },
  decode(reader: Reader, length?: number): Price {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(basePrice) as Price;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.currency = reader.string();
          break;
        case 3:
          message.id = reader.string();
          break;
        case 4:
          message.trialDays = reader.int32();
          break;
        case 5:
          message.amount = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Price {
    const message = Object.create(basePrice) as Price;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = String(object.currency);
    } else {
      message.currency = '';
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.trialDays !== undefined && object.trialDays !== null) {
      message.trialDays = Number(object.trialDays);
    } else {
      message.trialDays = 0;
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = Number(object.amount);
    } else {
      message.amount = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<Price>): Price {
    const message = Object.create(basePrice) as Price;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = object.currency;
    } else {
      message.currency = '';
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.trialDays !== undefined && object.trialDays !== null) {
      message.trialDays = object.trialDays;
    } else {
      message.trialDays = 0;
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    } else {
      message.amount = 0;
    }
    return message;
  },
  toJSON(message: Price): unknown {
    const obj: any = {};
    obj.name = message.name || '';
    obj.currency = message.currency || '';
    obj.id = message.id || '';
    obj.trialDays = message.trialDays || 0;
    obj.amount = message.amount || 0;
    return obj;
  },
};

export const StripePlan = {
  encode(message: StripePlan, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(18).string(message.currency);
    writer.uint32(26).string(message.id);
    writer.uint32(32).int32(message.trialDays);
    writer.uint32(45).float(message.amount);
    return writer;
  },
  decode(reader: Reader, length?: number): StripePlan {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseStripePlan) as StripePlan;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.currency = reader.string();
          break;
        case 3:
          message.id = reader.string();
          break;
        case 4:
          message.trialDays = reader.int32();
          break;
        case 5:
          message.amount = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): StripePlan {
    const message = Object.create(baseStripePlan) as StripePlan;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = String(object.currency);
    } else {
      message.currency = '';
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.trialDays !== undefined && object.trialDays !== null) {
      message.trialDays = Number(object.trialDays);
    } else {
      message.trialDays = 0;
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = Number(object.amount);
    } else {
      message.amount = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<StripePlan>): StripePlan {
    const message = Object.create(baseStripePlan) as StripePlan;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = object.currency;
    } else {
      message.currency = '';
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.trialDays !== undefined && object.trialDays !== null) {
      message.trialDays = object.trialDays;
    } else {
      message.trialDays = 0;
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    } else {
      message.amount = 0;
    }
    return message;
  },
  toJSON(message: StripePlan): unknown {
    const obj: any = {};
    obj.name = message.name || '';
    obj.currency = message.currency || '';
    obj.id = message.id || '';
    obj.trialDays = message.trialDays || 0;
    obj.amount = message.amount || 0;
    return obj;
  },
};

export const Feature = {
  encode(message: Feature, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(18).string(message.normalizedName);
    writer.uint32(26).string(message.description);
    writer.uint32(32).int32(message.min);
    writer.uint32(40).int32(message.max);
    writer.uint32(48).bool(message.active);
    writer.uint32(56).bool(message.full);
    writer.uint32(66).string(message.unit);
    return writer;
  },
  decode(reader: Reader, length?: number): Feature {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFeature) as Feature;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.normalizedName = reader.string();
          break;
        case 3:
          message.description = reader.string();
          break;
        case 4:
          message.min = reader.int32();
          break;
        case 5:
          message.max = reader.int32();
          break;
        case 6:
          message.active = reader.bool();
          break;
        case 7:
          message.full = reader.bool();
          break;
        case 8:
          message.unit = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Feature {
    const message = Object.create(baseFeature) as Feature;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.normalizedName !== undefined && object.normalizedName !== null) {
      message.normalizedName = String(object.normalizedName);
    } else {
      message.normalizedName = '';
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    } else {
      message.description = '';
    }
    if (object.min !== undefined && object.min !== null) {
      message.min = Number(object.min);
    } else {
      message.min = 0;
    }
    if (object.max !== undefined && object.max !== null) {
      message.max = Number(object.max);
    } else {
      message.max = 0;
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = Boolean(object.active);
    } else {
      message.active = false;
    }
    if (object.full !== undefined && object.full !== null) {
      message.full = Boolean(object.full);
    } else {
      message.full = false;
    }
    if (object.unit !== undefined && object.unit !== null) {
      message.unit = String(object.unit);
    } else {
      message.unit = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Feature>): Feature {
    const message = Object.create(baseFeature) as Feature;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.normalizedName !== undefined && object.normalizedName !== null) {
      message.normalizedName = object.normalizedName;
    } else {
      message.normalizedName = '';
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    } else {
      message.description = '';
    }
    if (object.min !== undefined && object.min !== null) {
      message.min = object.min;
    } else {
      message.min = 0;
    }
    if (object.max !== undefined && object.max !== null) {
      message.max = object.max;
    } else {
      message.max = 0;
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = object.active;
    } else {
      message.active = false;
    }
    if (object.full !== undefined && object.full !== null) {
      message.full = object.full;
    } else {
      message.full = false;
    }
    if (object.unit !== undefined && object.unit !== null) {
      message.unit = object.unit;
    } else {
      message.unit = '';
    }
    return message;
  },
  toJSON(message: Feature): unknown {
    const obj: any = {};
    obj.name = message.name || '';
    obj.normalizedName = message.normalizedName || '';
    obj.description = message.description || '';
    obj.min = message.min || 0;
    obj.max = message.max || 0;
    obj.active = message.active || false;
    obj.full = message.full || false;
    obj.unit = message.unit || '';
    return obj;
  },
};

export const Plan = {
  encode(message: Plan, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.normalizedName);
    if (message.price !== undefined && message.price !== undefined) {
      Price.encode(message.price, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.features) {
      Feature.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    writer.uint32(40).bool(message.active);
    writer.uint32(48).bool(message.free);
    writer.uint32(58).string(message.createdAt);
    writer.uint32(66).string(message.updatedAt);
    writer.uint32(74).string(message.name);
    writer.uint32(82).string(message.stripeId);
    return writer;
  },
  decode(reader: Reader, length?: number): Plan {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(basePlan) as Plan;
    message.features = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.normalizedName = reader.string();
          break;
        case 3:
          message.price = Price.decode(reader, reader.uint32());
          break;
        case 4:
          message.features.push(Feature.decode(reader, reader.uint32()));
          break;
        case 5:
          message.active = reader.bool();
          break;
        case 6:
          message.free = reader.bool();
          break;
        case 7:
          message.createdAt = reader.string();
          break;
        case 8:
          message.updatedAt = reader.string();
          break;
        case 9:
          message.name = reader.string();
          break;
        case 10:
          message.stripeId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Plan {
    const message = Object.create(basePlan) as Plan;
    message.features = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.normalizedName !== undefined && object.normalizedName !== null) {
      message.normalizedName = String(object.normalizedName);
    } else {
      message.normalizedName = '';
    }
    if (object.price !== undefined && object.price !== null) {
      message.price = Price.fromJSON(object.price);
    } else {
      message.price = undefined;
    }
    if (object.features !== undefined && object.features !== null) {
      for (const e of object.features) {
        message.features.push(Feature.fromJSON(e));
      }
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = Boolean(object.active);
    } else {
      message.active = false;
    }
    if (object.free !== undefined && object.free !== null) {
      message.free = Boolean(object.free);
    } else {
      message.free = false;
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = String(object.createdAt);
    } else {
      message.createdAt = '';
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = String(object.updatedAt);
    } else {
      message.updatedAt = '';
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.stripeId !== undefined && object.stripeId !== null) {
      message.stripeId = String(object.stripeId);
    } else {
      message.stripeId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Plan>): Plan {
    const message = Object.create(basePlan) as Plan;
    message.features = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.normalizedName !== undefined && object.normalizedName !== null) {
      message.normalizedName = object.normalizedName;
    } else {
      message.normalizedName = '';
    }
    if (object.price !== undefined && object.price !== null) {
      message.price = Price.fromPartial(object.price);
    } else {
      message.price = undefined;
    }
    if (object.features !== undefined && object.features !== null) {
      for (const e of object.features) {
        message.features.push(Feature.fromPartial(e));
      }
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = object.active;
    } else {
      message.active = false;
    }
    if (object.free !== undefined && object.free !== null) {
      message.free = object.free;
    } else {
      message.free = false;
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = object.createdAt;
    } else {
      message.createdAt = '';
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = object.updatedAt;
    } else {
      message.updatedAt = '';
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.stripeId !== undefined && object.stripeId !== null) {
      message.stripeId = object.stripeId;
    } else {
      message.stripeId = '';
    }
    return message;
  },
  toJSON(message: Plan): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.normalizedName = message.normalizedName || '';
    obj.price = message.price ? Price.toJSON(message.price) : undefined;
    if (message.features) {
      obj.features = message.features.map(e => e ? Feature.toJSON(e) : undefined);
    } else {
      obj.features = [];
    }
    obj.active = message.active || false;
    obj.free = message.free || false;
    obj.createdAt = message.createdAt || '';
    obj.updatedAt = message.updatedAt || '';
    obj.name = message.name || '';
    obj.stripeId = message.stripeId || '';
    return obj;
  },
};

export const Invoice = {
  encode(message: Invoice, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.accountCountry);
    writer.uint32(26).string(message.accountName);
    writer.uint32(37).float(message.amountDue);
    writer.uint32(45).float(message.amountPaid);
    writer.uint32(53).float(message.amountRemaining);
    writer.uint32(58).string(message.billingReason);
    writer.uint32(66).string(message.currency);
    writer.uint32(74).string(message.customerEmail);
    writer.uint32(82).string(message.customerName);
    writer.uint32(90).string(message.description);
    writer.uint32(98).string(message.dueDate);
    writer.uint32(109).float(message.endingBalance);
    writer.uint32(114).string(message.hostedInvoiceUrl);
    writer.uint32(122).string(message.invoicePdf);
    writer.uint32(130).string(message.number);
    writer.uint32(136).bool(message.paid);
    writer.uint32(146).string(message.receiptNumber);
    writer.uint32(157).float(message.startingBalance);
    writer.uint32(162).string(message.statementDescriptor);
    writer.uint32(170).string(message.status);
    writer.uint32(176).int32(message.subtotal);
    writer.uint32(189).float(message.tax);
    writer.uint32(197).float(message.taxPercent);
    writer.uint32(205).float(message.total);
    writer.uint32(210).string(message.createdAt);
    writer.uint32(218).string(message.updatedAt);
    return writer;
  },
  decode(reader: Reader, length?: number): Invoice {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseInvoice) as Invoice;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.accountCountry = reader.string();
          break;
        case 3:
          message.accountName = reader.string();
          break;
        case 4:
          message.amountDue = reader.float();
          break;
        case 5:
          message.amountPaid = reader.float();
          break;
        case 6:
          message.amountRemaining = reader.float();
          break;
        case 7:
          message.billingReason = reader.string();
          break;
        case 8:
          message.currency = reader.string();
          break;
        case 9:
          message.customerEmail = reader.string();
          break;
        case 10:
          message.customerName = reader.string();
          break;
        case 11:
          message.description = reader.string();
          break;
        case 12:
          message.dueDate = reader.string();
          break;
        case 13:
          message.endingBalance = reader.float();
          break;
        case 14:
          message.hostedInvoiceUrl = reader.string();
          break;
        case 15:
          message.invoicePdf = reader.string();
          break;
        case 16:
          message.number = reader.string();
          break;
        case 17:
          message.paid = reader.bool();
          break;
        case 18:
          message.receiptNumber = reader.string();
          break;
        case 19:
          message.startingBalance = reader.float();
          break;
        case 20:
          message.statementDescriptor = reader.string();
          break;
        case 21:
          message.status = reader.string();
          break;
        case 22:
          message.subtotal = reader.int32();
          break;
        case 23:
          message.tax = reader.float();
          break;
        case 24:
          message.taxPercent = reader.float();
          break;
        case 25:
          message.total = reader.float();
          break;
        case 26:
          message.createdAt = reader.string();
          break;
        case 27:
          message.updatedAt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Invoice {
    const message = Object.create(baseInvoice) as Invoice;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.accountCountry !== undefined && object.accountCountry !== null) {
      message.accountCountry = String(object.accountCountry);
    } else {
      message.accountCountry = '';
    }
    if (object.accountName !== undefined && object.accountName !== null) {
      message.accountName = String(object.accountName);
    } else {
      message.accountName = '';
    }
    if (object.amountDue !== undefined && object.amountDue !== null) {
      message.amountDue = Number(object.amountDue);
    } else {
      message.amountDue = 0;
    }
    if (object.amountPaid !== undefined && object.amountPaid !== null) {
      message.amountPaid = Number(object.amountPaid);
    } else {
      message.amountPaid = 0;
    }
    if (object.amountRemaining !== undefined && object.amountRemaining !== null) {
      message.amountRemaining = Number(object.amountRemaining);
    } else {
      message.amountRemaining = 0;
    }
    if (object.billingReason !== undefined && object.billingReason !== null) {
      message.billingReason = String(object.billingReason);
    } else {
      message.billingReason = '';
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = String(object.currency);
    } else {
      message.currency = '';
    }
    if (object.customerEmail !== undefined && object.customerEmail !== null) {
      message.customerEmail = String(object.customerEmail);
    } else {
      message.customerEmail = '';
    }
    if (object.customerName !== undefined && object.customerName !== null) {
      message.customerName = String(object.customerName);
    } else {
      message.customerName = '';
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    } else {
      message.description = '';
    }
    if (object.dueDate !== undefined && object.dueDate !== null) {
      message.dueDate = String(object.dueDate);
    } else {
      message.dueDate = '';
    }
    if (object.endingBalance !== undefined && object.endingBalance !== null) {
      message.endingBalance = Number(object.endingBalance);
    } else {
      message.endingBalance = 0;
    }
    if (object.hostedInvoiceUrl !== undefined && object.hostedInvoiceUrl !== null) {
      message.hostedInvoiceUrl = String(object.hostedInvoiceUrl);
    } else {
      message.hostedInvoiceUrl = '';
    }
    if (object.invoicePdf !== undefined && object.invoicePdf !== null) {
      message.invoicePdf = String(object.invoicePdf);
    } else {
      message.invoicePdf = '';
    }
    if (object.number !== undefined && object.number !== null) {
      message.number = String(object.number);
    } else {
      message.number = '';
    }
    if (object.paid !== undefined && object.paid !== null) {
      message.paid = Boolean(object.paid);
    } else {
      message.paid = false;
    }
    if (object.receiptNumber !== undefined && object.receiptNumber !== null) {
      message.receiptNumber = String(object.receiptNumber);
    } else {
      message.receiptNumber = '';
    }
    if (object.startingBalance !== undefined && object.startingBalance !== null) {
      message.startingBalance = Number(object.startingBalance);
    } else {
      message.startingBalance = 0;
    }
    if (object.statementDescriptor !== undefined && object.statementDescriptor !== null) {
      message.statementDescriptor = String(object.statementDescriptor);
    } else {
      message.statementDescriptor = '';
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = String(object.status);
    } else {
      message.status = '';
    }
    if (object.subtotal !== undefined && object.subtotal !== null) {
      message.subtotal = Number(object.subtotal);
    } else {
      message.subtotal = 0;
    }
    if (object.tax !== undefined && object.tax !== null) {
      message.tax = Number(object.tax);
    } else {
      message.tax = 0;
    }
    if (object.taxPercent !== undefined && object.taxPercent !== null) {
      message.taxPercent = Number(object.taxPercent);
    } else {
      message.taxPercent = 0;
    }
    if (object.total !== undefined && object.total !== null) {
      message.total = Number(object.total);
    } else {
      message.total = 0;
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = String(object.createdAt);
    } else {
      message.createdAt = '';
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = String(object.updatedAt);
    } else {
      message.updatedAt = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Invoice>): Invoice {
    const message = Object.create(baseInvoice) as Invoice;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.accountCountry !== undefined && object.accountCountry !== null) {
      message.accountCountry = object.accountCountry;
    } else {
      message.accountCountry = '';
    }
    if (object.accountName !== undefined && object.accountName !== null) {
      message.accountName = object.accountName;
    } else {
      message.accountName = '';
    }
    if (object.amountDue !== undefined && object.amountDue !== null) {
      message.amountDue = object.amountDue;
    } else {
      message.amountDue = 0;
    }
    if (object.amountPaid !== undefined && object.amountPaid !== null) {
      message.amountPaid = object.amountPaid;
    } else {
      message.amountPaid = 0;
    }
    if (object.amountRemaining !== undefined && object.amountRemaining !== null) {
      message.amountRemaining = object.amountRemaining;
    } else {
      message.amountRemaining = 0;
    }
    if (object.billingReason !== undefined && object.billingReason !== null) {
      message.billingReason = object.billingReason;
    } else {
      message.billingReason = '';
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = object.currency;
    } else {
      message.currency = '';
    }
    if (object.customerEmail !== undefined && object.customerEmail !== null) {
      message.customerEmail = object.customerEmail;
    } else {
      message.customerEmail = '';
    }
    if (object.customerName !== undefined && object.customerName !== null) {
      message.customerName = object.customerName;
    } else {
      message.customerName = '';
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    } else {
      message.description = '';
    }
    if (object.dueDate !== undefined && object.dueDate !== null) {
      message.dueDate = object.dueDate;
    } else {
      message.dueDate = '';
    }
    if (object.endingBalance !== undefined && object.endingBalance !== null) {
      message.endingBalance = object.endingBalance;
    } else {
      message.endingBalance = 0;
    }
    if (object.hostedInvoiceUrl !== undefined && object.hostedInvoiceUrl !== null) {
      message.hostedInvoiceUrl = object.hostedInvoiceUrl;
    } else {
      message.hostedInvoiceUrl = '';
    }
    if (object.invoicePdf !== undefined && object.invoicePdf !== null) {
      message.invoicePdf = object.invoicePdf;
    } else {
      message.invoicePdf = '';
    }
    if (object.number !== undefined && object.number !== null) {
      message.number = object.number;
    } else {
      message.number = '';
    }
    if (object.paid !== undefined && object.paid !== null) {
      message.paid = object.paid;
    } else {
      message.paid = false;
    }
    if (object.receiptNumber !== undefined && object.receiptNumber !== null) {
      message.receiptNumber = object.receiptNumber;
    } else {
      message.receiptNumber = '';
    }
    if (object.startingBalance !== undefined && object.startingBalance !== null) {
      message.startingBalance = object.startingBalance;
    } else {
      message.startingBalance = 0;
    }
    if (object.statementDescriptor !== undefined && object.statementDescriptor !== null) {
      message.statementDescriptor = object.statementDescriptor;
    } else {
      message.statementDescriptor = '';
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = object.status;
    } else {
      message.status = '';
    }
    if (object.subtotal !== undefined && object.subtotal !== null) {
      message.subtotal = object.subtotal;
    } else {
      message.subtotal = 0;
    }
    if (object.tax !== undefined && object.tax !== null) {
      message.tax = object.tax;
    } else {
      message.tax = 0;
    }
    if (object.taxPercent !== undefined && object.taxPercent !== null) {
      message.taxPercent = object.taxPercent;
    } else {
      message.taxPercent = 0;
    }
    if (object.total !== undefined && object.total !== null) {
      message.total = object.total;
    } else {
      message.total = 0;
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = object.createdAt;
    } else {
      message.createdAt = '';
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = object.updatedAt;
    } else {
      message.updatedAt = '';
    }
    return message;
  },
  toJSON(message: Invoice): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.accountCountry = message.accountCountry || '';
    obj.accountName = message.accountName || '';
    obj.amountDue = message.amountDue || 0;
    obj.amountPaid = message.amountPaid || 0;
    obj.amountRemaining = message.amountRemaining || 0;
    obj.billingReason = message.billingReason || '';
    obj.currency = message.currency || '';
    obj.customerEmail = message.customerEmail || '';
    obj.customerName = message.customerName || '';
    obj.description = message.description || '';
    obj.dueDate = message.dueDate || '';
    obj.endingBalance = message.endingBalance || 0;
    obj.hostedInvoiceUrl = message.hostedInvoiceUrl || '';
    obj.invoicePdf = message.invoicePdf || '';
    obj.number = message.number || '';
    obj.paid = message.paid || false;
    obj.receiptNumber = message.receiptNumber || '';
    obj.startingBalance = message.startingBalance || 0;
    obj.statementDescriptor = message.statementDescriptor || '';
    obj.status = message.status || '';
    obj.subtotal = message.subtotal || 0;
    obj.tax = message.tax || 0;
    obj.taxPercent = message.taxPercent || 0;
    obj.total = message.total || 0;
    obj.createdAt = message.createdAt || '';
    obj.updatedAt = message.updatedAt || '';
    return obj;
  },
};

export const CreatePriceRequest = {
  encode(message: CreatePriceRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(13).float(message.price);
    writer.uint32(18).string(message.currency);
    writer.uint32(26).string(message.id);
    writer.uint32(34).string(message.nickname);
    writer.uint32(40).int32(message.trialDays);
    writer.uint32(48).int32(message.intervalCount);
    writer.uint32(58).string(message.interval);
    return writer;
  },
  decode(reader: Reader, length?: number): CreatePriceRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreatePriceRequest) as CreatePriceRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.price = reader.float();
          break;
        case 2:
          message.currency = reader.string();
          break;
        case 3:
          message.id = reader.string();
          break;
        case 4:
          message.nickname = reader.string();
          break;
        case 5:
          message.trialDays = reader.int32();
          break;
        case 6:
          message.intervalCount = reader.int32();
          break;
        case 7:
          message.interval = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreatePriceRequest {
    const message = Object.create(baseCreatePriceRequest) as CreatePriceRequest;
    if (object.price !== undefined && object.price !== null) {
      message.price = Number(object.price);
    } else {
      message.price = 0;
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = String(object.currency);
    } else {
      message.currency = '';
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.nickname !== undefined && object.nickname !== null) {
      message.nickname = String(object.nickname);
    } else {
      message.nickname = '';
    }
    if (object.trialDays !== undefined && object.trialDays !== null) {
      message.trialDays = Number(object.trialDays);
    } else {
      message.trialDays = 0;
    }
    if (object.intervalCount !== undefined && object.intervalCount !== null) {
      message.intervalCount = Number(object.intervalCount);
    } else {
      message.intervalCount = 0;
    }
    if (object.interval !== undefined && object.interval !== null) {
      message.interval = String(object.interval);
    } else {
      message.interval = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreatePriceRequest>): CreatePriceRequest {
    const message = Object.create(baseCreatePriceRequest) as CreatePriceRequest;
    if (object.price !== undefined && object.price !== null) {
      message.price = object.price;
    } else {
      message.price = 0;
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = object.currency;
    } else {
      message.currency = '';
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.nickname !== undefined && object.nickname !== null) {
      message.nickname = object.nickname;
    } else {
      message.nickname = '';
    }
    if (object.trialDays !== undefined && object.trialDays !== null) {
      message.trialDays = object.trialDays;
    } else {
      message.trialDays = 0;
    }
    if (object.intervalCount !== undefined && object.intervalCount !== null) {
      message.intervalCount = object.intervalCount;
    } else {
      message.intervalCount = 0;
    }
    if (object.interval !== undefined && object.interval !== null) {
      message.interval = object.interval;
    } else {
      message.interval = '';
    }
    return message;
  },
  toJSON(message: CreatePriceRequest): unknown {
    const obj: any = {};
    obj.price = message.price || 0;
    obj.currency = message.currency || '';
    obj.id = message.id || '';
    obj.nickname = message.nickname || '';
    obj.trialDays = message.trialDays || 0;
    obj.intervalCount = message.intervalCount || 0;
    obj.interval = message.interval || '';
    return obj;
  },
};

export const CreatePlanRequest = {
  encode(message: CreatePlanRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(18).string(message.description);
    for (const v of message.prices) {
      CreatePriceRequest.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.features) {
      Feature.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    writer.uint32(64).bool(message.active);
    writer.uint32(72).bool(message.free);
    return writer;
  },
  decode(reader: Reader, length?: number): CreatePlanRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreatePlanRequest) as CreatePlanRequest;
    message.prices = [];
    message.features = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.prices.push(CreatePriceRequest.decode(reader, reader.uint32()));
          break;
        case 4:
          message.features.push(Feature.decode(reader, reader.uint32()));
          break;
        case 8:
          message.active = reader.bool();
          break;
        case 9:
          message.free = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreatePlanRequest {
    const message = Object.create(baseCreatePlanRequest) as CreatePlanRequest;
    message.prices = [];
    message.features = [];
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    } else {
      message.description = '';
    }
    if (object.prices !== undefined && object.prices !== null) {
      for (const e of object.prices) {
        message.prices.push(CreatePriceRequest.fromJSON(e));
      }
    }
    if (object.features !== undefined && object.features !== null) {
      for (const e of object.features) {
        message.features.push(Feature.fromJSON(e));
      }
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = Boolean(object.active);
    } else {
      message.active = false;
    }
    if (object.free !== undefined && object.free !== null) {
      message.free = Boolean(object.free);
    } else {
      message.free = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreatePlanRequest>): CreatePlanRequest {
    const message = Object.create(baseCreatePlanRequest) as CreatePlanRequest;
    message.prices = [];
    message.features = [];
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    } else {
      message.description = '';
    }
    if (object.prices !== undefined && object.prices !== null) {
      for (const e of object.prices) {
        message.prices.push(CreatePriceRequest.fromPartial(e));
      }
    }
    if (object.features !== undefined && object.features !== null) {
      for (const e of object.features) {
        message.features.push(Feature.fromPartial(e));
      }
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = object.active;
    } else {
      message.active = false;
    }
    if (object.free !== undefined && object.free !== null) {
      message.free = object.free;
    } else {
      message.free = false;
    }
    return message;
  },
  toJSON(message: CreatePlanRequest): unknown {
    const obj: any = {};
    obj.name = message.name || '';
    obj.description = message.description || '';
    if (message.prices) {
      obj.prices = message.prices.map(e => e ? CreatePriceRequest.toJSON(e) : undefined);
    } else {
      obj.prices = [];
    }
    if (message.features) {
      obj.features = message.features.map(e => e ? Feature.toJSON(e) : undefined);
    } else {
      obj.features = [];
    }
    obj.active = message.active || false;
    obj.free = message.free || false;
    return obj;
  },
};

export const CreatePlanResponse = {
  encode(message: CreatePlanResponse, writer: Writer = Writer.create()): Writer {
    if (message.plan !== undefined && message.plan !== undefined) {
      Plan.encode(message.plan, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): CreatePlanResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreatePlanResponse) as CreatePlanResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.plan = Plan.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreatePlanResponse {
    const message = Object.create(baseCreatePlanResponse) as CreatePlanResponse;
    if (object.plan !== undefined && object.plan !== null) {
      message.plan = Plan.fromJSON(object.plan);
    } else {
      message.plan = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreatePlanResponse>): CreatePlanResponse {
    const message = Object.create(baseCreatePlanResponse) as CreatePlanResponse;
    if (object.plan !== undefined && object.plan !== null) {
      message.plan = Plan.fromPartial(object.plan);
    } else {
      message.plan = undefined;
    }
    return message;
  },
  toJSON(message: CreatePlanResponse): unknown {
    const obj: any = {};
    obj.plan = message.plan ? Plan.toJSON(message.plan) : undefined;
    return obj;
  },
};

export const ReadPlanRequest = {
  encode(message: ReadPlanRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadPlanRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadPlanRequest) as ReadPlanRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadPlanRequest {
    const message = Object.create(baseReadPlanRequest) as ReadPlanRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadPlanRequest>): ReadPlanRequest {
    const message = Object.create(baseReadPlanRequest) as ReadPlanRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: ReadPlanRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const ReadPlanResponse = {
  encode(message: ReadPlanResponse, writer: Writer = Writer.create()): Writer {
    if (message.plan !== undefined && message.plan !== undefined) {
      Plan.encode(message.plan, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadPlanResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadPlanResponse) as ReadPlanResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.plan = Plan.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadPlanResponse {
    const message = Object.create(baseReadPlanResponse) as ReadPlanResponse;
    if (object.plan !== undefined && object.plan !== null) {
      message.plan = Plan.fromJSON(object.plan);
    } else {
      message.plan = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadPlanResponse>): ReadPlanResponse {
    const message = Object.create(baseReadPlanResponse) as ReadPlanResponse;
    if (object.plan !== undefined && object.plan !== null) {
      message.plan = Plan.fromPartial(object.plan);
    } else {
      message.plan = undefined;
    }
    return message;
  },
  toJSON(message: ReadPlanResponse): unknown {
    const obj: any = {};
    obj.plan = message.plan ? Plan.toJSON(message.plan) : undefined;
    return obj;
  },
};

export const FindPlansRequest = {
  encode(message: FindPlansRequest, writer: Writer = Writer.create()): Writer {
    return writer;
  },
  decode(reader: Reader, length?: number): FindPlansRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindPlansRequest) as FindPlansRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindPlansRequest {
    const message = Object.create(baseFindPlansRequest) as FindPlansRequest;
    return message;
  },
  fromPartial(object: DeepPartial<FindPlansRequest>): FindPlansRequest {
    const message = Object.create(baseFindPlansRequest) as FindPlansRequest;
    return message;
  },
  toJSON(message: FindPlansRequest): unknown {
    const obj: any = {};
    return obj;
  },
};

export const FindPlansResponse = {
  encode(message: FindPlansResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.plans) {
      Plan.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): FindPlansResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindPlansResponse) as FindPlansResponse;
    message.plans = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.plans.push(Plan.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindPlansResponse {
    const message = Object.create(baseFindPlansResponse) as FindPlansResponse;
    message.plans = [];
    if (object.plans !== undefined && object.plans !== null) {
      for (const e of object.plans) {
        message.plans.push(Plan.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindPlansResponse>): FindPlansResponse {
    const message = Object.create(baseFindPlansResponse) as FindPlansResponse;
    message.plans = [];
    if (object.plans !== undefined && object.plans !== null) {
      for (const e of object.plans) {
        message.plans.push(Plan.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: FindPlansResponse): unknown {
    const obj: any = {};
    if (message.plans) {
      obj.plans = message.plans.map(e => e ? Plan.toJSON(e) : undefined);
    } else {
      obj.plans = [];
    }
    return obj;
  },
};

export const ReadStripePlanRequest = {
  encode(message: ReadStripePlanRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadStripePlanRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadStripePlanRequest) as ReadStripePlanRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadStripePlanRequest {
    const message = Object.create(baseReadStripePlanRequest) as ReadStripePlanRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadStripePlanRequest>): ReadStripePlanRequest {
    const message = Object.create(baseReadStripePlanRequest) as ReadStripePlanRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: ReadStripePlanRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const ReadStripePlanResponse = {
  encode(message: ReadStripePlanResponse, writer: Writer = Writer.create()): Writer {
    if (message.plan !== undefined && message.plan !== undefined) {
      StripePlan.encode(message.plan, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadStripePlanResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadStripePlanResponse) as ReadStripePlanResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.plan = StripePlan.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadStripePlanResponse {
    const message = Object.create(baseReadStripePlanResponse) as ReadStripePlanResponse;
    if (object.plan !== undefined && object.plan !== null) {
      message.plan = StripePlan.fromJSON(object.plan);
    } else {
      message.plan = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadStripePlanResponse>): ReadStripePlanResponse {
    const message = Object.create(baseReadStripePlanResponse) as ReadStripePlanResponse;
    if (object.plan !== undefined && object.plan !== null) {
      message.plan = StripePlan.fromPartial(object.plan);
    } else {
      message.plan = undefined;
    }
    return message;
  },
  toJSON(message: ReadStripePlanResponse): unknown {
    const obj: any = {};
    obj.plan = message.plan ? StripePlan.toJSON(message.plan) : undefined;
    return obj;
  },
};

export const FindStripePlansRequest = {
  encode(message: FindStripePlansRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.productId);
    return writer;
  },
  decode(reader: Reader, length?: number): FindStripePlansRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindStripePlansRequest) as FindStripePlansRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindStripePlansRequest {
    const message = Object.create(baseFindStripePlansRequest) as FindStripePlansRequest;
    if (object.productId !== undefined && object.productId !== null) {
      message.productId = String(object.productId);
    } else {
      message.productId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindStripePlansRequest>): FindStripePlansRequest {
    const message = Object.create(baseFindStripePlansRequest) as FindStripePlansRequest;
    if (object.productId !== undefined && object.productId !== null) {
      message.productId = object.productId;
    } else {
      message.productId = '';
    }
    return message;
  },
  toJSON(message: FindStripePlansRequest): unknown {
    const obj: any = {};
    obj.productId = message.productId || '';
    return obj;
  },
};

export const FindStripePlansResponse = {
  encode(message: FindStripePlansResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.plans) {
      StripePlan.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): FindStripePlansResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindStripePlansResponse) as FindStripePlansResponse;
    message.plans = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.plans.push(StripePlan.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindStripePlansResponse {
    const message = Object.create(baseFindStripePlansResponse) as FindStripePlansResponse;
    message.plans = [];
    if (object.plans !== undefined && object.plans !== null) {
      for (const e of object.plans) {
        message.plans.push(StripePlan.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindStripePlansResponse>): FindStripePlansResponse {
    const message = Object.create(baseFindStripePlansResponse) as FindStripePlansResponse;
    message.plans = [];
    if (object.plans !== undefined && object.plans !== null) {
      for (const e of object.plans) {
        message.plans.push(StripePlan.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: FindStripePlansResponse): unknown {
    const obj: any = {};
    if (message.plans) {
      obj.plans = message.plans.map(e => e ? StripePlan.toJSON(e) : undefined);
    } else {
      obj.plans = [];
    }
    return obj;
  },
};

export const ReadInvoiceRequest = {
  encode(message: ReadInvoiceRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadInvoiceRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadInvoiceRequest) as ReadInvoiceRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadInvoiceRequest {
    const message = Object.create(baseReadInvoiceRequest) as ReadInvoiceRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadInvoiceRequest>): ReadInvoiceRequest {
    const message = Object.create(baseReadInvoiceRequest) as ReadInvoiceRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: ReadInvoiceRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const ReadInvoiceResponse = {
  encode(message: ReadInvoiceResponse, writer: Writer = Writer.create()): Writer {
    if (message.invoice !== undefined && message.invoice !== undefined) {
      Invoice.encode(message.invoice, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadInvoiceResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadInvoiceResponse) as ReadInvoiceResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.invoice = Invoice.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadInvoiceResponse {
    const message = Object.create(baseReadInvoiceResponse) as ReadInvoiceResponse;
    if (object.invoice !== undefined && object.invoice !== null) {
      message.invoice = Invoice.fromJSON(object.invoice);
    } else {
      message.invoice = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadInvoiceResponse>): ReadInvoiceResponse {
    const message = Object.create(baseReadInvoiceResponse) as ReadInvoiceResponse;
    if (object.invoice !== undefined && object.invoice !== null) {
      message.invoice = Invoice.fromPartial(object.invoice);
    } else {
      message.invoice = undefined;
    }
    return message;
  },
  toJSON(message: ReadInvoiceResponse): unknown {
    const obj: any = {};
    obj.invoice = message.invoice ? Invoice.toJSON(message.invoice) : undefined;
    return obj;
  },
};

export const FindInvoicesRequest = {
  encode(message: FindInvoicesRequest, writer: Writer = Writer.create()): Writer {
    return writer;
  },
  decode(reader: Reader, length?: number): FindInvoicesRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindInvoicesRequest) as FindInvoicesRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindInvoicesRequest {
    const message = Object.create(baseFindInvoicesRequest) as FindInvoicesRequest;
    return message;
  },
  fromPartial(object: DeepPartial<FindInvoicesRequest>): FindInvoicesRequest {
    const message = Object.create(baseFindInvoicesRequest) as FindInvoicesRequest;
    return message;
  },
  toJSON(message: FindInvoicesRequest): unknown {
    const obj: any = {};
    return obj;
  },
};

export const FindInvoicesResponse = {
  encode(message: FindInvoicesResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.invoices) {
      Invoice.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): FindInvoicesResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindInvoicesResponse) as FindInvoicesResponse;
    message.invoices = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.invoices.push(Invoice.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindInvoicesResponse {
    const message = Object.create(baseFindInvoicesResponse) as FindInvoicesResponse;
    message.invoices = [];
    if (object.invoices !== undefined && object.invoices !== null) {
      for (const e of object.invoices) {
        message.invoices.push(Invoice.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindInvoicesResponse>): FindInvoicesResponse {
    const message = Object.create(baseFindInvoicesResponse) as FindInvoicesResponse;
    message.invoices = [];
    if (object.invoices !== undefined && object.invoices !== null) {
      for (const e of object.invoices) {
        message.invoices.push(Invoice.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: FindInvoicesResponse): unknown {
    const obj: any = {};
    if (message.invoices) {
      obj.invoices = message.invoices.map(e => e ? Invoice.toJSON(e) : undefined);
    } else {
      obj.invoices = [];
    }
    return obj;
  },
};

export const CreateSubscriptionRequest = {
  encode(message: CreateSubscriptionRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.customerId);
    writer.uint32(18).string(message.tenantId);
    writer.uint32(26).string(message.planId);
    writer.uint32(34).string(message.couponId);
    writer.uint32(42).string(message.cardId);
    return writer;
  },
  decode(reader: Reader, length?: number): CreateSubscriptionRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateSubscriptionRequest) as CreateSubscriptionRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.customerId = reader.string();
          break;
        case 2:
          message.tenantId = reader.string();
          break;
        case 3:
          message.planId = reader.string();
          break;
        case 4:
          message.couponId = reader.string();
          break;
        case 5:
          message.cardId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateSubscriptionRequest {
    const message = Object.create(baseCreateSubscriptionRequest) as CreateSubscriptionRequest;
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = String(object.customerId);
    } else {
      message.customerId = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    if (object.planId !== undefined && object.planId !== null) {
      message.planId = String(object.planId);
    } else {
      message.planId = '';
    }
    if (object.couponId !== undefined && object.couponId !== null) {
      message.couponId = String(object.couponId);
    } else {
      message.couponId = '';
    }
    if (object.cardId !== undefined && object.cardId !== null) {
      message.cardId = String(object.cardId);
    } else {
      message.cardId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateSubscriptionRequest>): CreateSubscriptionRequest {
    const message = Object.create(baseCreateSubscriptionRequest) as CreateSubscriptionRequest;
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
    } else {
      message.customerId = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    if (object.planId !== undefined && object.planId !== null) {
      message.planId = object.planId;
    } else {
      message.planId = '';
    }
    if (object.couponId !== undefined && object.couponId !== null) {
      message.couponId = object.couponId;
    } else {
      message.couponId = '';
    }
    if (object.cardId !== undefined && object.cardId !== null) {
      message.cardId = object.cardId;
    } else {
      message.cardId = '';
    }
    return message;
  },
  toJSON(message: CreateSubscriptionRequest): unknown {
    const obj: any = {};
    obj.customerId = message.customerId || '';
    obj.tenantId = message.tenantId || '';
    obj.planId = message.planId || '';
    obj.couponId = message.couponId || '';
    obj.cardId = message.cardId || '';
    return obj;
  },
};

export const CreateSubscriptionResponse = {
  encode(message: CreateSubscriptionResponse, writer: Writer = Writer.create()): Writer {
    if (message.subscription !== undefined && message.subscription !== undefined) {
      TenantSubscription.encode(message.subscription, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): CreateSubscriptionResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateSubscriptionResponse) as CreateSubscriptionResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subscription = TenantSubscription.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateSubscriptionResponse {
    const message = Object.create(baseCreateSubscriptionResponse) as CreateSubscriptionResponse;
    if (object.subscription !== undefined && object.subscription !== null) {
      message.subscription = TenantSubscription.fromJSON(object.subscription);
    } else {
      message.subscription = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateSubscriptionResponse>): CreateSubscriptionResponse {
    const message = Object.create(baseCreateSubscriptionResponse) as CreateSubscriptionResponse;
    if (object.subscription !== undefined && object.subscription !== null) {
      message.subscription = TenantSubscription.fromPartial(object.subscription);
    } else {
      message.subscription = undefined;
    }
    return message;
  },
  toJSON(message: CreateSubscriptionResponse): unknown {
    const obj: any = {};
    obj.subscription = message.subscription ? TenantSubscription.toJSON(message.subscription) : undefined;
    return obj;
  },
};

export const ChangeSubscriptionRequest = {
  encode(message: ChangeSubscriptionRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.customerId);
    writer.uint32(18).string(message.tenantId);
    writer.uint32(26).string(message.planId);
    writer.uint32(34).string(message.couponId);
    return writer;
  },
  decode(reader: Reader, length?: number): ChangeSubscriptionRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseChangeSubscriptionRequest) as ChangeSubscriptionRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.customerId = reader.string();
          break;
        case 2:
          message.tenantId = reader.string();
          break;
        case 3:
          message.planId = reader.string();
          break;
        case 4:
          message.couponId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ChangeSubscriptionRequest {
    const message = Object.create(baseChangeSubscriptionRequest) as ChangeSubscriptionRequest;
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = String(object.customerId);
    } else {
      message.customerId = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    if (object.planId !== undefined && object.planId !== null) {
      message.planId = String(object.planId);
    } else {
      message.planId = '';
    }
    if (object.couponId !== undefined && object.couponId !== null) {
      message.couponId = String(object.couponId);
    } else {
      message.couponId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ChangeSubscriptionRequest>): ChangeSubscriptionRequest {
    const message = Object.create(baseChangeSubscriptionRequest) as ChangeSubscriptionRequest;
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
    } else {
      message.customerId = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    if (object.planId !== undefined && object.planId !== null) {
      message.planId = object.planId;
    } else {
      message.planId = '';
    }
    if (object.couponId !== undefined && object.couponId !== null) {
      message.couponId = object.couponId;
    } else {
      message.couponId = '';
    }
    return message;
  },
  toJSON(message: ChangeSubscriptionRequest): unknown {
    const obj: any = {};
    obj.customerId = message.customerId || '';
    obj.tenantId = message.tenantId || '';
    obj.planId = message.planId || '';
    obj.couponId = message.couponId || '';
    return obj;
  },
};

export const ChangeSubscriptionResponse = {
  encode(message: ChangeSubscriptionResponse, writer: Writer = Writer.create()): Writer {
    if (message.subscription !== undefined && message.subscription !== undefined) {
      TenantSubscription.encode(message.subscription, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ChangeSubscriptionResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseChangeSubscriptionResponse) as ChangeSubscriptionResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subscription = TenantSubscription.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ChangeSubscriptionResponse {
    const message = Object.create(baseChangeSubscriptionResponse) as ChangeSubscriptionResponse;
    if (object.subscription !== undefined && object.subscription !== null) {
      message.subscription = TenantSubscription.fromJSON(object.subscription);
    } else {
      message.subscription = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ChangeSubscriptionResponse>): ChangeSubscriptionResponse {
    const message = Object.create(baseChangeSubscriptionResponse) as ChangeSubscriptionResponse;
    if (object.subscription !== undefined && object.subscription !== null) {
      message.subscription = TenantSubscription.fromPartial(object.subscription);
    } else {
      message.subscription = undefined;
    }
    return message;
  },
  toJSON(message: ChangeSubscriptionResponse): unknown {
    const obj: any = {};
    obj.subscription = message.subscription ? TenantSubscription.toJSON(message.subscription) : undefined;
    return obj;
  },
};

export const CancelSubscriptionRequest = {
  encode(message: CancelSubscriptionRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.customerId);
    writer.uint32(18).string(message.tenantId);
    return writer;
  },
  decode(reader: Reader, length?: number): CancelSubscriptionRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCancelSubscriptionRequest) as CancelSubscriptionRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.customerId = reader.string();
          break;
        case 2:
          message.tenantId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CancelSubscriptionRequest {
    const message = Object.create(baseCancelSubscriptionRequest) as CancelSubscriptionRequest;
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = String(object.customerId);
    } else {
      message.customerId = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<CancelSubscriptionRequest>): CancelSubscriptionRequest {
    const message = Object.create(baseCancelSubscriptionRequest) as CancelSubscriptionRequest;
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
    } else {
      message.customerId = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    return message;
  },
  toJSON(message: CancelSubscriptionRequest): unknown {
    const obj: any = {};
    obj.customerId = message.customerId || '';
    obj.tenantId = message.tenantId || '';
    return obj;
  },
};

export const CancelSubscriptionResponse = {
  encode(message: CancelSubscriptionResponse, writer: Writer = Writer.create()): Writer {
    if (message.subscription !== undefined && message.subscription !== undefined) {
      TenantSubscription.encode(message.subscription, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): CancelSubscriptionResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCancelSubscriptionResponse) as CancelSubscriptionResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subscription = TenantSubscription.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CancelSubscriptionResponse {
    const message = Object.create(baseCancelSubscriptionResponse) as CancelSubscriptionResponse;
    if (object.subscription !== undefined && object.subscription !== null) {
      message.subscription = TenantSubscription.fromJSON(object.subscription);
    } else {
      message.subscription = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CancelSubscriptionResponse>): CancelSubscriptionResponse {
    const message = Object.create(baseCancelSubscriptionResponse) as CancelSubscriptionResponse;
    if (object.subscription !== undefined && object.subscription !== null) {
      message.subscription = TenantSubscription.fromPartial(object.subscription);
    } else {
      message.subscription = undefined;
    }
    return message;
  },
  toJSON(message: CancelSubscriptionResponse): unknown {
    const obj: any = {};
    obj.subscription = message.subscription ? TenantSubscription.toJSON(message.subscription) : undefined;
    return obj;
  },
};

export const ReadSubscriptionRequest = {
  encode(message: ReadSubscriptionRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.tenantId);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadSubscriptionRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadSubscriptionRequest) as ReadSubscriptionRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.tenantId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadSubscriptionRequest {
    const message = Object.create(baseReadSubscriptionRequest) as ReadSubscriptionRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadSubscriptionRequest>): ReadSubscriptionRequest {
    const message = Object.create(baseReadSubscriptionRequest) as ReadSubscriptionRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    return message;
  },
  toJSON(message: ReadSubscriptionRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.tenantId = message.tenantId || '';
    return obj;
  },
};

export const ReadSubscriptionResponse = {
  encode(message: ReadSubscriptionResponse, writer: Writer = Writer.create()): Writer {
    if (message.subscription !== undefined && message.subscription !== undefined) {
      TenantSubscription.encode(message.subscription, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadSubscriptionResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadSubscriptionResponse) as ReadSubscriptionResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subscription = TenantSubscription.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadSubscriptionResponse {
    const message = Object.create(baseReadSubscriptionResponse) as ReadSubscriptionResponse;
    if (object.subscription !== undefined && object.subscription !== null) {
      message.subscription = TenantSubscription.fromJSON(object.subscription);
    } else {
      message.subscription = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadSubscriptionResponse>): ReadSubscriptionResponse {
    const message = Object.create(baseReadSubscriptionResponse) as ReadSubscriptionResponse;
    if (object.subscription !== undefined && object.subscription !== null) {
      message.subscription = TenantSubscription.fromPartial(object.subscription);
    } else {
      message.subscription = undefined;
    }
    return message;
  },
  toJSON(message: ReadSubscriptionResponse): unknown {
    const obj: any = {};
    obj.subscription = message.subscription ? TenantSubscription.toJSON(message.subscription) : undefined;
    return obj;
  },
};

export const FindSubscriptionsRequest = {
  encode(message: FindSubscriptionsRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.tenantId);
    return writer;
  },
  decode(reader: Reader, length?: number): FindSubscriptionsRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindSubscriptionsRequest) as FindSubscriptionsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenantId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindSubscriptionsRequest {
    const message = Object.create(baseFindSubscriptionsRequest) as FindSubscriptionsRequest;
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindSubscriptionsRequest>): FindSubscriptionsRequest {
    const message = Object.create(baseFindSubscriptionsRequest) as FindSubscriptionsRequest;
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    return message;
  },
  toJSON(message: FindSubscriptionsRequest): unknown {
    const obj: any = {};
    obj.tenantId = message.tenantId || '';
    return obj;
  },
};

export const FindSubscriptionsResponse = {
  encode(message: FindSubscriptionsResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.subscriptions) {
      TenantSubscription.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): FindSubscriptionsResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindSubscriptionsResponse) as FindSubscriptionsResponse;
    message.subscriptions = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subscriptions.push(TenantSubscription.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindSubscriptionsResponse {
    const message = Object.create(baseFindSubscriptionsResponse) as FindSubscriptionsResponse;
    message.subscriptions = [];
    if (object.subscriptions !== undefined && object.subscriptions !== null) {
      for (const e of object.subscriptions) {
        message.subscriptions.push(TenantSubscription.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindSubscriptionsResponse>): FindSubscriptionsResponse {
    const message = Object.create(baseFindSubscriptionsResponse) as FindSubscriptionsResponse;
    message.subscriptions = [];
    if (object.subscriptions !== undefined && object.subscriptions !== null) {
      for (const e of object.subscriptions) {
        message.subscriptions.push(TenantSubscription.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: FindSubscriptionsResponse): unknown {
    const obj: any = {};
    if (message.subscriptions) {
      obj.subscriptions = message.subscriptions.map(e => e ? TenantSubscription.toJSON(e) : undefined);
    } else {
      obj.subscriptions = [];
    }
    return obj;
  },
};

export const CreateCardRequest = {
  encode(message: CreateCardRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(18).string(message.cvc);
    writer.uint32(26).string(message.number);
    writer.uint32(34).string(message.currency);
    writer.uint32(66).string(message.expMonth);
    writer.uint32(74).string(message.expYear);
    if (message.address !== undefined && message.address !== undefined) {
      Address.encode(message.address, writer.uint32(82).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): CreateCardRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateCardRequest) as CreateCardRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.cvc = reader.string();
          break;
        case 3:
          message.number = reader.string();
          break;
        case 4:
          message.currency = reader.string();
          break;
        case 8:
          message.expMonth = reader.string();
          break;
        case 9:
          message.expYear = reader.string();
          break;
        case 10:
          message.address = Address.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateCardRequest {
    const message = Object.create(baseCreateCardRequest) as CreateCardRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.cvc !== undefined && object.cvc !== null) {
      message.cvc = String(object.cvc);
    } else {
      message.cvc = '';
    }
    if (object.number !== undefined && object.number !== null) {
      message.number = String(object.number);
    } else {
      message.number = '';
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = String(object.currency);
    } else {
      message.currency = '';
    }
    if (object.expMonth !== undefined && object.expMonth !== null) {
      message.expMonth = String(object.expMonth);
    } else {
      message.expMonth = '';
    }
    if (object.expYear !== undefined && object.expYear !== null) {
      message.expYear = String(object.expYear);
    } else {
      message.expYear = '';
    }
    if (object.address !== undefined && object.address !== null) {
      message.address = Address.fromJSON(object.address);
    } else {
      message.address = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateCardRequest>): CreateCardRequest {
    const message = Object.create(baseCreateCardRequest) as CreateCardRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.cvc !== undefined && object.cvc !== null) {
      message.cvc = object.cvc;
    } else {
      message.cvc = '';
    }
    if (object.number !== undefined && object.number !== null) {
      message.number = object.number;
    } else {
      message.number = '';
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = object.currency;
    } else {
      message.currency = '';
    }
    if (object.expMonth !== undefined && object.expMonth !== null) {
      message.expMonth = object.expMonth;
    } else {
      message.expMonth = '';
    }
    if (object.expYear !== undefined && object.expYear !== null) {
      message.expYear = object.expYear;
    } else {
      message.expYear = '';
    }
    if (object.address !== undefined && object.address !== null) {
      message.address = Address.fromPartial(object.address);
    } else {
      message.address = undefined;
    }
    return message;
  },
  toJSON(message: CreateCardRequest): unknown {
    const obj: any = {};
    obj.name = message.name || '';
    obj.cvc = message.cvc || '';
    obj.number = message.number || '';
    obj.currency = message.currency || '';
    obj.expMonth = message.expMonth || '';
    obj.expYear = message.expYear || '';
    obj.address = message.address ? Address.toJSON(message.address) : undefined;
    return obj;
  },
};

export const CreateCardResponse = {
  encode(message: CreateCardResponse, writer: Writer = Writer.create()): Writer {
    if (message.card !== undefined && message.card !== undefined) {
      Card.encode(message.card, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): CreateCardResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateCardResponse) as CreateCardResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.card = Card.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateCardResponse {
    const message = Object.create(baseCreateCardResponse) as CreateCardResponse;
    if (object.card !== undefined && object.card !== null) {
      message.card = Card.fromJSON(object.card);
    } else {
      message.card = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateCardResponse>): CreateCardResponse {
    const message = Object.create(baseCreateCardResponse) as CreateCardResponse;
    if (object.card !== undefined && object.card !== null) {
      message.card = Card.fromPartial(object.card);
    } else {
      message.card = undefined;
    }
    return message;
  },
  toJSON(message: CreateCardResponse): unknown {
    const obj: any = {};
    obj.card = message.card ? Card.toJSON(message.card) : undefined;
    return obj;
  },
};

export const SetDefaultCardRequest = {
  encode(message: SetDefaultCardRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): SetDefaultCardRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseSetDefaultCardRequest) as SetDefaultCardRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): SetDefaultCardRequest {
    const message = Object.create(baseSetDefaultCardRequest) as SetDefaultCardRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<SetDefaultCardRequest>): SetDefaultCardRequest {
    const message = Object.create(baseSetDefaultCardRequest) as SetDefaultCardRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: SetDefaultCardRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const SetDefaultCardResponse = {
  encode(message: SetDefaultCardResponse, writer: Writer = Writer.create()): Writer {
    if (message.card !== undefined && message.card !== undefined) {
      Card.encode(message.card, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): SetDefaultCardResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseSetDefaultCardResponse) as SetDefaultCardResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.card = Card.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): SetDefaultCardResponse {
    const message = Object.create(baseSetDefaultCardResponse) as SetDefaultCardResponse;
    if (object.card !== undefined && object.card !== null) {
      message.card = Card.fromJSON(object.card);
    } else {
      message.card = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<SetDefaultCardResponse>): SetDefaultCardResponse {
    const message = Object.create(baseSetDefaultCardResponse) as SetDefaultCardResponse;
    if (object.card !== undefined && object.card !== null) {
      message.card = Card.fromPartial(object.card);
    } else {
      message.card = undefined;
    }
    return message;
  },
  toJSON(message: SetDefaultCardResponse): unknown {
    const obj: any = {};
    obj.card = message.card ? Card.toJSON(message.card) : undefined;
    return obj;
  },
};

export const DeleteCardRequest = {
  encode(message: DeleteCardRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteCardRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteCardRequest) as DeleteCardRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DeleteCardRequest {
    const message = Object.create(baseDeleteCardRequest) as DeleteCardRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteCardRequest>): DeleteCardRequest {
    const message = Object.create(baseDeleteCardRequest) as DeleteCardRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: DeleteCardRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const DeleteCardResponse = {
  encode(message: DeleteCardResponse, writer: Writer = Writer.create()): Writer {
    if (message.card !== undefined && message.card !== undefined) {
      Card.encode(message.card, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteCardResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteCardResponse) as DeleteCardResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.card = Card.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DeleteCardResponse {
    const message = Object.create(baseDeleteCardResponse) as DeleteCardResponse;
    if (object.card !== undefined && object.card !== null) {
      message.card = Card.fromJSON(object.card);
    } else {
      message.card = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteCardResponse>): DeleteCardResponse {
    const message = Object.create(baseDeleteCardResponse) as DeleteCardResponse;
    if (object.card !== undefined && object.card !== null) {
      message.card = Card.fromPartial(object.card);
    } else {
      message.card = undefined;
    }
    return message;
  },
  toJSON(message: DeleteCardResponse): unknown {
    const obj: any = {};
    obj.card = message.card ? Card.toJSON(message.card) : undefined;
    return obj;
  },
};

export const ReadCardRequest = {
  encode(message: ReadCardRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadCardRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadCardRequest) as ReadCardRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadCardRequest {
    const message = Object.create(baseReadCardRequest) as ReadCardRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadCardRequest>): ReadCardRequest {
    const message = Object.create(baseReadCardRequest) as ReadCardRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: ReadCardRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const ReadCardResponse = {
  encode(message: ReadCardResponse, writer: Writer = Writer.create()): Writer {
    if (message.card !== undefined && message.card !== undefined) {
      Card.encode(message.card, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadCardResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadCardResponse) as ReadCardResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.card = Card.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadCardResponse {
    const message = Object.create(baseReadCardResponse) as ReadCardResponse;
    if (object.card !== undefined && object.card !== null) {
      message.card = Card.fromJSON(object.card);
    } else {
      message.card = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadCardResponse>): ReadCardResponse {
    const message = Object.create(baseReadCardResponse) as ReadCardResponse;
    if (object.card !== undefined && object.card !== null) {
      message.card = Card.fromPartial(object.card);
    } else {
      message.card = undefined;
    }
    return message;
  },
  toJSON(message: ReadCardResponse): unknown {
    const obj: any = {};
    obj.card = message.card ? Card.toJSON(message.card) : undefined;
    return obj;
  },
};

export const FindCardsRequest = {
  encode(message: FindCardsRequest, writer: Writer = Writer.create()): Writer {
    return writer;
  },
  decode(reader: Reader, length?: number): FindCardsRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindCardsRequest) as FindCardsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindCardsRequest {
    const message = Object.create(baseFindCardsRequest) as FindCardsRequest;
    return message;
  },
  fromPartial(object: DeepPartial<FindCardsRequest>): FindCardsRequest {
    const message = Object.create(baseFindCardsRequest) as FindCardsRequest;
    return message;
  },
  toJSON(message: FindCardsRequest): unknown {
    const obj: any = {};
    return obj;
  },
};

export const FindCardsResponse = {
  encode(message: FindCardsResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.cards) {
      Card.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): FindCardsResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindCardsResponse) as FindCardsResponse;
    message.cards = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cards.push(Card.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindCardsResponse {
    const message = Object.create(baseFindCardsResponse) as FindCardsResponse;
    message.cards = [];
    if (object.cards !== undefined && object.cards !== null) {
      for (const e of object.cards) {
        message.cards.push(Card.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindCardsResponse>): FindCardsResponse {
    const message = Object.create(baseFindCardsResponse) as FindCardsResponse;
    message.cards = [];
    if (object.cards !== undefined && object.cards !== null) {
      for (const e of object.cards) {
        message.cards.push(Card.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: FindCardsResponse): unknown {
    const obj: any = {};
    if (message.cards) {
      obj.cards = message.cards.map(e => e ? Card.toJSON(e) : undefined);
    } else {
      obj.cards = [];
    }
    return obj;
  },
};

export const CreateCustomerRequest = {
  encode(message: CreateCustomerRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(18).string(message.email);
    writer.uint32(26).string(message.number);
    writer.uint32(34).string(message.currency);
    return writer;
  },
  decode(reader: Reader, length?: number): CreateCustomerRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateCustomerRequest) as CreateCustomerRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.email = reader.string();
          break;
        case 3:
          message.number = reader.string();
          break;
        case 4:
          message.currency = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateCustomerRequest {
    const message = Object.create(baseCreateCustomerRequest) as CreateCustomerRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    } else {
      message.email = '';
    }
    if (object.number !== undefined && object.number !== null) {
      message.number = String(object.number);
    } else {
      message.number = '';
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = String(object.currency);
    } else {
      message.currency = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateCustomerRequest>): CreateCustomerRequest {
    const message = Object.create(baseCreateCustomerRequest) as CreateCustomerRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    } else {
      message.email = '';
    }
    if (object.number !== undefined && object.number !== null) {
      message.number = object.number;
    } else {
      message.number = '';
    }
    if (object.currency !== undefined && object.currency !== null) {
      message.currency = object.currency;
    } else {
      message.currency = '';
    }
    return message;
  },
  toJSON(message: CreateCustomerRequest): unknown {
    const obj: any = {};
    obj.name = message.name || '';
    obj.email = message.email || '';
    obj.number = message.number || '';
    obj.currency = message.currency || '';
    return obj;
  },
};

export const CreateCustomerResponse = {
  encode(message: CreateCustomerResponse, writer: Writer = Writer.create()): Writer {
    if (message.customer !== undefined && message.customer !== undefined) {
      Customer.encode(message.customer, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): CreateCustomerResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateCustomerResponse) as CreateCustomerResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.customer = Customer.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateCustomerResponse {
    const message = Object.create(baseCreateCustomerResponse) as CreateCustomerResponse;
    if (object.customer !== undefined && object.customer !== null) {
      message.customer = Customer.fromJSON(object.customer);
    } else {
      message.customer = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateCustomerResponse>): CreateCustomerResponse {
    const message = Object.create(baseCreateCustomerResponse) as CreateCustomerResponse;
    if (object.customer !== undefined && object.customer !== null) {
      message.customer = Customer.fromPartial(object.customer);
    } else {
      message.customer = undefined;
    }
    return message;
  },
  toJSON(message: CreateCustomerResponse): unknown {
    const obj: any = {};
    obj.customer = message.customer ? Customer.toJSON(message.customer) : undefined;
    return obj;
  },
};

export const DeleteCustomerRequest = {
  encode(message: DeleteCustomerRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteCustomerRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteCustomerRequest) as DeleteCustomerRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DeleteCustomerRequest {
    const message = Object.create(baseDeleteCustomerRequest) as DeleteCustomerRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteCustomerRequest>): DeleteCustomerRequest {
    const message = Object.create(baseDeleteCustomerRequest) as DeleteCustomerRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: DeleteCustomerRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const DeleteCustomerResponse = {
  encode(message: DeleteCustomerResponse, writer: Writer = Writer.create()): Writer {
    if (message.customer !== undefined && message.customer !== undefined) {
      Customer.encode(message.customer, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteCustomerResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteCustomerResponse) as DeleteCustomerResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.customer = Customer.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DeleteCustomerResponse {
    const message = Object.create(baseDeleteCustomerResponse) as DeleteCustomerResponse;
    if (object.customer !== undefined && object.customer !== null) {
      message.customer = Customer.fromJSON(object.customer);
    } else {
      message.customer = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteCustomerResponse>): DeleteCustomerResponse {
    const message = Object.create(baseDeleteCustomerResponse) as DeleteCustomerResponse;
    if (object.customer !== undefined && object.customer !== null) {
      message.customer = Customer.fromPartial(object.customer);
    } else {
      message.customer = undefined;
    }
    return message;
  },
  toJSON(message: DeleteCustomerResponse): unknown {
    const obj: any = {};
    obj.customer = message.customer ? Customer.toJSON(message.customer) : undefined;
    return obj;
  },
};

export const ReadCustomerRequest = {
  encode(message: ReadCustomerRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadCustomerRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadCustomerRequest) as ReadCustomerRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadCustomerRequest {
    const message = Object.create(baseReadCustomerRequest) as ReadCustomerRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadCustomerRequest>): ReadCustomerRequest {
    const message = Object.create(baseReadCustomerRequest) as ReadCustomerRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: ReadCustomerRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const ReadCustomerResponse = {
  encode(message: ReadCustomerResponse, writer: Writer = Writer.create()): Writer {
    if (message.customer !== undefined && message.customer !== undefined) {
      Customer.encode(message.customer, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadCustomerResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadCustomerResponse) as ReadCustomerResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.customer = Customer.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadCustomerResponse {
    const message = Object.create(baseReadCustomerResponse) as ReadCustomerResponse;
    if (object.customer !== undefined && object.customer !== null) {
      message.customer = Customer.fromJSON(object.customer);
    } else {
      message.customer = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadCustomerResponse>): ReadCustomerResponse {
    const message = Object.create(baseReadCustomerResponse) as ReadCustomerResponse;
    if (object.customer !== undefined && object.customer !== null) {
      message.customer = Customer.fromPartial(object.customer);
    } else {
      message.customer = undefined;
    }
    return message;
  },
  toJSON(message: ReadCustomerResponse): unknown {
    const obj: any = {};
    obj.customer = message.customer ? Customer.toJSON(message.customer) : undefined;
    return obj;
  },
};

export const Message = {
  encode(message: Message, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.say);
    return writer;
  },
  decode(reader: Reader, length?: number): Message {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseMessage) as Message;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.say = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Message {
    const message = Object.create(baseMessage) as Message;
    if (object.say !== undefined && object.say !== null) {
      message.say = String(object.say);
    } else {
      message.say = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Message>): Message {
    const message = Object.create(baseMessage) as Message;
    if (object.say !== undefined && object.say !== null) {
      message.say = object.say;
    } else {
      message.say = '';
    }
    return message;
  },
  toJSON(message: Message): unknown {
    const obj: any = {};
    obj.say = message.say || '';
    return obj;
  },
};

export const Event = {
  encode(message: Event, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(16).int32(message.timestamp);
    writer.uint32(26).string(message.message);
    writer.uint32(34).string(message.topic);
    return writer;
  },
  decode(reader: Reader, length?: number): Event {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseEvent) as Event;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.timestamp = reader.int32();
          break;
        case 3:
          message.message = reader.string();
          break;
        case 4:
          message.topic = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Event {
    const message = Object.create(baseEvent) as Event;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.timestamp !== undefined && object.timestamp !== null) {
      message.timestamp = Number(object.timestamp);
    } else {
      message.timestamp = 0;
    }
    if (object.message !== undefined && object.message !== null) {
      message.message = String(object.message);
    } else {
      message.message = '';
    }
    if (object.topic !== undefined && object.topic !== null) {
      message.topic = String(object.topic);
    } else {
      message.topic = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Event>): Event {
    const message = Object.create(baseEvent) as Event;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.timestamp !== undefined && object.timestamp !== null) {
      message.timestamp = object.timestamp;
    } else {
      message.timestamp = 0;
    }
    if (object.message !== undefined && object.message !== null) {
      message.message = object.message;
    } else {
      message.message = '';
    }
    if (object.topic !== undefined && object.topic !== null) {
      message.topic = object.topic;
    } else {
      message.topic = '';
    }
    return message;
  },
  toJSON(message: Event): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.timestamp = message.timestamp || 0;
    obj.message = message.message || '';
    obj.topic = message.topic || '';
    return obj;
  },
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T[P] extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T[P] extends Date | Function | Uint8Array | undefined
  ? T[P]
  : T[P] extends infer U | undefined
  ? DeepPartial<U>
  : T[P] extends object
  ? DeepPartial<T[P]>
  : T[P]
};