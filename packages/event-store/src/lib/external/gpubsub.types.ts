/*******************************************************************************
 * Copyright (c) 2021. Rex Isaac Raphael
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * File name:         gpubsub.types.ts
 * Last modified:     26/02/2021, 00:52
 ******************************************************************************/

import { EventEmitter } from 'events';

export declare type GetTopicsResponse = PagedResponse<Topic, any>;

export declare type GetSubscriptionsResponse =
  | any
  | GetTopicSubscriptionsResponse;

export interface PageOptions {
  gaxOpts?: CallOptions;
  pageSize?: number;
  pageToken?: string;
  autoPaginate?: boolean;
}

export declare type SetSubscriptionMetadataResponse = MetadataResponse;

export interface MessageStreamOptions {
  highWaterMark?: number;
  maxStreams?: number;
  timeout?: number;
}
export interface ResourceCallback<Resource, Response> {
  (
    err: any | null,
    resource?: Resource | null,
    response?: Response | null
  ): void;
}
export declare type RequestCallback<T, R = void> = R extends void
  ? NormalCallback<T>
  : PagedCallback<T, R>;
export interface NormalCallback<TResponse> {
  (err: any | null, res?: TResponse | null): void;
}
export interface PagedCallback<Item, Response> {
  (
    err: any | null,
    results?: Item[] | null,
    nextQuery?: {} | null,
    response?: Response | null
  ): void;
}
export declare type DetachedResponse = [boolean];
export declare type ExistsResponse = [boolean];

export declare type PagedResponse<Item, Response> =
  | [Item[]]
  | [Item[], {} | null, Response];

declare type SubscriptionResponse = [Subscription, any];
export declare type CreateSubscriptionResponse = SubscriptionResponse;

export declare type TopicMetadata = any;
declare type TopicCallback = ResourceCallback<Topic, TopicMetadata>;
declare type TopicResponse = [Topic, TopicMetadata];
export declare type CreateTopicCallback = TopicCallback;
export declare type CreateTopicResponse = TopicResponse;
export declare type GetTopicResponse = TopicResponse;
export declare type GetTopicOptions = CallOptions & {
  autoCreate?: boolean;
};
declare type MetadataCallback = RequestCallback<TopicMetadata>;
declare type MetadataResponse = [TopicMetadata];
export declare type SetTopicMetadataCallback = MetadataCallback;
export declare type SetTopicMetadataResponse = MetadataResponse;

export declare type GetTopicSubscriptionsResponse = PagedResponse<
  Subscription,
  any
>;
export declare type MessageOptions = Record<string, any> & {
  json?: any;
};

export declare type GetSubscriptionResponse = SubscriptionResponse;

export declare type EmptyResponse = [any];

export interface Attributes {
  [key: string]: string;
}

export interface BackoffSettings {
  maxRetries?: number;
  initialRetryDelayMillis: number;
  retryDelayMultiplier: number;
  maxRetryDelayMillis: number;
  initialRpcTimeoutMillis?: number | null;
  maxRpcTimeoutMillis?: number | null;
  totalTimeoutMillis?: number | null;
  rpcTimeoutMultiplier?: number | null;
}
export interface BatchOptions {
  callOptions?: CallOptions;
  maxMessages?: number;
  maxMilliseconds?: number;
}
export interface FlowControlOptions {
  allowExcessMessages?: boolean;
  maxBytes?: number;
  maxExtension?: number;
  maxMessages?: number;
}

export declare class RetryOptions {
  retryCodes: number[];
  backoffSettings: BackoffSettings;
}

export interface BundleOptions {
  elementCountLimit?: number;
  requestByteLimit?: number;
  elementCountThreshold?: number;
  requestByteThreshold?: number;
  delayThreshold?: number;
}

export interface CallOptions {
  timeout?: number;
  retry?: Partial<RetryOptions> | null;
  autoPaginate?: boolean;
  pageToken?: string;
  pageSize?: number;
  maxResults?: number;
  maxRetries?: number;
  otherArgs?: {
    [index: string]: any;
  };
  bundleOptions?: BundleOptions | null;
  isBundling?: boolean;
  longrunning?: BackoffSettings;
  apiName?: string;
  retryRequestOptions?: RetryRequestOptions;
}

export interface RetryRequestOptions {
  objectMode?: boolean;
  request?: any;
  retries?: number;
  noResponseRetries?: number;
  currentRetryAttempt?: number;
  shouldRetryFn?: () => boolean;
}

export declare type CreateSubscriptionOptions = Record<string, any> & {
  gaxOpts?: CallOptions;
  flowControl?: FlowControlOptions;
};

export interface BatchPublishOptions {
  maxBytes?: number;
  maxMessages?: number;
  maxMilliseconds?: number;
}

export declare type GetSubscriptionsOptions = PageOptions & {
  topic?: string | Topic;
};

export interface PublishOptions {
  batching?: BatchPublishOptions;
  gaxOpts?: CallOptions;
  messageOrdering?: boolean;
  enableOpenTelemetryTracing?: boolean;
}
export declare type GetSubscriptionOptions = CallOptions & {
  autoCreate?: boolean;
};

export interface SubscriberOptions {
  ackDeadline?: number;
  batching?: BatchOptions;
  flowControl?: FlowControlOptions;
  useLegacyFlowControl?: boolean;
  streamingOptions?: MessageStreamOptions;
  enableOpenTelemetryTracing?: boolean;
}

export declare type SubscriptionOptions = SubscriberOptions & {
  topic?: Topic;
};

export declare type GetSubscriptionMetadataResponse = MetadataResponse;

export interface ClientConfig {
  apiEndpoint?: string;
  servicePath?: string;
  port?: string | number;
  sslCreds?: any;
  auth?: any;
  grpc?: any;
  /**
   * Path to a .json, .pem, or .p12 key file
   */
  keyFilename?: string;
  /**
   * Path to a .json, .pem, or .p12 key file
   */
  keyFile?: string;
  /**
   * Object containing client_email and private_key properties, or the
   * external account client options.
   */
  credentials?: CredentialBody | any;
  /**
   * Options object passed to the constructor of the client
   */
  clientOptions?: JWTOptions | OAuth2ClientOptions | any;
  /**
   * Required scopes for the desired API request
   */
  scopes?: string | string[];
  /**
   * Your project ID.
   */
  projectId?: string;
}

export declare class Topic {
  name: string;
  metadata?: TopicMetadata;
  flush(): Promise<void>;
  create(gaxOpts?: CallOptions): Promise<CreateTopicResponse>;
  createSubscription(
    name: string,
    options?: CreateSubscriptionOptions
  ): Promise<CreateSubscriptionResponse>;
  delete(gaxOpts?: CallOptions): Promise<EmptyResponse>;
  exists(): Promise<ExistsResponse>;
  get(gaxOpts?: GetTopicOptions): Promise<GetTopicResponse>;
  getSubscriptions(
    options?: PageOptions
  ): Promise<GetTopicSubscriptionsResponse>;
  publish(data: Buffer, attributes?: Attributes): Promise<string>;
  publishJSON(json: object, attributes?: Attributes): Promise<string>;
  publishMessage(message: MessageOptions): Promise<[string]>;

  resumePublishing(orderingKey: string): void;
  setMetadata(
    options: TopicMetadata,
    gaxOpts?: CallOptions
  ): Promise<SetTopicMetadataResponse>;
  setMetadata(options: TopicMetadata, callback: SetTopicMetadataCallback): void;
  setMetadata(
    options: TopicMetadata,
    gaxOpts: CallOptions,
    callback: SetTopicMetadataCallback
  ): void;

  setPublishOptions(options: PublishOptions): void;

  subscription(name: string, options?: SubscriptionOptions): Subscription;

  static formatName_(projectId: string, name: string): string;
}

export declare class PubSub {
  isEmulator: boolean;
  projectId: string;
  isOpen: boolean;
  constructor(options?: ClientConfig);
  close(): Promise<void>;
  createSubscription(
    topic: Topic | string,
    name: string,
    options?: CreateSubscriptionOptions
  ): Promise<CreateSubscriptionResponse>;
  createTopic(
    name: string,
    gaxOpts?: CallOptions
  ): Promise<CreateTopicResponse>;

  getSubscriptions(
    options?: GetSubscriptionsOptions
  ): Promise<GetSubscriptionsResponse>;
  getTopics(options?: PageOptions): Promise<GetTopicsResponse>;

  subscription(name: string, options?: SubscriptionOptions): Subscription;
  /**
   * Create a Topic object. See {@link PubSub#createTopic} to create a topic.
   *
   * @throws {Error} If a name is not provided.
   *
   * @param {string} name The name of the topic.
   * @param {PublishOptions} [options] Publisher configuration object.
   * @returns {Topic} A {@link Topic} instance.
   *
   * @example
   * const {PubSub} = require('@google-cloud/pubsub');
   * const pubsub = new PubSub();
   *
   * const topic = pubsub.topic('my-topic');
   */
  topic(name: string, options?: PublishOptions): Topic;
}

export declare class Subscription extends EventEmitter {
  pubsub: PubSub;
  /**
   * Indicates if the Subscription is open and receiving messages.
   *
   * @type {boolean}
   */
  get isOpen(): boolean;
  /**
   * @type {string}
   */
  get projectId(): string;
  close(): Promise<void>;
  create(
    options?: CreateSubscriptionOptions
  ): Promise<CreateSubscriptionResponse>;
  delete(gaxOpts?: CallOptions): Promise<EmptyResponse>;
  detached(): Promise<DetachedResponse>;
  exists(): Promise<ExistsResponse>;
  get(gaxOpts?: GetSubscriptionOptions): Promise<GetSubscriptionResponse>;
  getMetadata(gaxOpts?: CallOptions): Promise<GetSubscriptionMetadataResponse>;
  /**
   * Opens the Subscription to receive messages. In general this method
   * shouldn't need to be called, unless you wish to receive messages after
   * calling {@link Subscription#close}. Alternatively one could just assign a
   * new `message` event listener which will also re-open the Subscription.
   *
   * @example
   * subscription.on('message', message => message.ack());
   *
   * // Close the subscription.
   * subscription.close(err => {
   *   if (err) {
   *     // Error handling omitted.
   *   }
   *
   *   The subscription has been closed and messages will no longer be received.
   * });
   *
   * // Resume receiving messages.
   * subscription.open();
   */
  open(): void;
  setMetadata(
    metadata: any,
    gaxOpts?: CallOptions
  ): Promise<SetSubscriptionMetadataResponse>;
  /**
   * Sets the Subscription options.
   *
   * @param {SubscriberOptions} options The options.
   */
  setOptions(options: SubscriberOptions): void;
}

export interface Credentials {
  /**
   * This field is only present if the access_type parameter was set to offline in the authentication request. For details, see Refresh tokens.
   */
  refresh_token?: string | null;
  /**
   * The time in ms at which this token is thought to expire.
   */
  expiry_date?: number | null;
  /**
   * A token that can be sent to a Google API.
   */
  access_token?: string | null;
  /**
   * Identifies the type of token returned. At this time, this field always has the value Bearer.
   */
  token_type?: string | null;
  /**
   * A JWT that contains identity information about the user that is digitally signed by Google.
   */
  id_token?: string | null;
  /**
   * The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.
   */
  scope?: string;
}
export interface CredentialRequest {
  /**
   * This field is only present if the access_type parameter was set to offline in the authentication request. For details, see Refresh tokens.
   */
  refresh_token?: string;
  /**
   * A token that can be sent to a Google API.
   */
  access_token?: string;
  /**
   * Identifies the type of token returned. At this time, this field always has the value Bearer.
   */
  token_type?: string;
  /**
   * The remaining lifetime of the access token in seconds.
   */
  expires_in?: number;
  /**
   * A JWT that contains identity information about the user that is digitally signed by Google.
   */
  id_token?: string;
  /**
   * The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.
   */
  scope?: string;
}

export interface OAuth2ClientOptions extends RefreshOptions {
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
}
export interface RefreshOptions {
  eagerRefreshThresholdMillis?: number;
  forceRefreshOnFailure?: boolean;
}

export interface CredentialBody {
  client_email?: string;
  private_key?: string;
}

export interface JWTOptions extends RefreshOptions {
  email?: string;
  keyFile?: string;
  key?: string;
  keyId?: string;
  scopes?: string | string[];
  subject?: string;
  additionalClaims?: {};
}
