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
 * File name:         kafka.types.ts
 * Last modified:     07/05/2021, 23:20
 ******************************************************************************/

import * as tls from 'tls';
import * as net from 'net';

export type BrokersFunction = () => string[] | Promise<string[]>;

export interface ISocketFactoryArgs {
  host: string;
  port: number;
  ssl: tls.ConnectionOptions;
  onConnect: () => void;
}

export type ISocketFactory = (args: ISocketFactoryArgs) => net.Socket;

export interface OauthbearerProviderResponse {
  value: string;
}

export interface RetryOptions {
  maxRetryTime?: number;
  initialRetryTime?: number;
  factor?: number;
  multiplier?: number;
  retries?: number;
}

type SASLMechanismOptionsMap = {
  plain: { username: string; password: string };
  'scram-sha-256': { username: string; password: string };
  'scram-sha-512': { username: string; password: string };
  aws: {
    authorizationIdentity: string;
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  };
  oauthbearer: {
    oauthBearerProvider: () => Promise<OauthbearerProviderResponse>;
  };
};

export type SASLMechanism = keyof SASLMechanismOptionsMap;
type SASLMechanismOptions<T> = T extends SASLMechanism
  ? { mechanism: T } & SASLMechanismOptionsMap[T]
  : never;
export type SASLOptions = SASLMechanismOptions<SASLMechanism>;

type ValueOf<T> = T[keyof T];

export interface KafkaConfig {
  brokers: string[] | BrokersFunction;
  ssl?: tls.ConnectionOptions | boolean;
  sasl?: SASLOptions;
  clientId?: string;
  connectionTimeout?: number;
  authenticationTimeout?: number;
  reauthenticationThreshold?: number;
  requestTimeout?: number;
  enforceRequestTimeout?: boolean;
  retry?: RetryOptions;
  socketFactory?: ISocketFactory;
  logLevel?: any;
  logCreator?: any;
}

export interface ProducerConfig {
  createPartitioner?: ICustomPartitioner;
  retry?: RetryOptions;
  metadataMaxAge?: number;
  allowAutoTopicCreation?: boolean;
  idempotent?: boolean;
  transactionalId?: string;
  transactionTimeout?: number;
  maxInFlightRequests?: number;
}

type Sender = {
  send(record: ProducerRecord): Promise<RecordMetadata[]>;
  sendBatch(batch: ProducerBatch): Promise<RecordMetadata[]>;
};

export type ProducerEvents = {
  CONNECT: 'producer.connect';
  DISCONNECT: 'producer.disconnect';
  REQUEST: 'producer.network.request';
  REQUEST_TIMEOUT: 'producer.network.request_timeout';
  REQUEST_QUEUE_SIZE: 'producer.network.request_queue_size';
};

export type Producer = Sender & {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isIdempotent(): boolean;
  events: ProducerEvents;
  on(
    eventName: ValueOf<ProducerEvents>,
    listener: (...args: any[]) => void
  ): RemoveInstrumentationEventListener<typeof eventName>;
  transaction(): Promise<Transaction>;
  logger(): Logger;
};

export type Transaction = Sender & {
  sendOffsets(offsets: Offsets & { consumerGroupId: string }): Promise<void>;
  commit(): Promise<void>;
  abort(): Promise<void>;
  isActive(): boolean;
};

export declare class Kafka {
  constructor(config: KafkaConfig);
  producer(config?: ProducerConfig): Producer;
  consumer(config?: ConsumerConfig): Consumer;
  admin(config?: AdminConfig): any;
  logger(): Logger;
}

export type KafkaMessage = {
  key: Buffer;
  value: Buffer | null;
  timestamp: string;
  size: number;
  attributes: number;
  offset: string;
  headers?: IHeaders;
};

export interface ProducerRecord {
  topic: string;
  messages: Message[];
  acks?: number;
  timeout?: number;
  compression?: CompressionTypes;
}

export type RecordMetadata = {
  topicName: string;
  partition: number;
  errorCode: number;
  offset?: string;
  timestamp?: string;
  baseOffset?: string;
  logAppendTime?: string;
  logStartOffset?: string;
};

export interface InstrumentationEvent<T> {
  id: string;
  type: string;
  timestamp: number;
  payload: T;
}

export type RemoveInstrumentationEventListener<T> = () => void;

export type ConnectEvent = InstrumentationEvent<null>;
export type DisconnectEvent = InstrumentationEvent<null>;

export interface TopicMessages {
  topic: string;
  messages: Message[];
}

export interface ProducerBatch {
  acks?: number;
  timeout?: number;
  compression?: CompressionTypes;
  topicMessages?: TopicMessages[];
}

export interface PartitionOffset {
  partition: number;
  offset: string;
}

export interface TopicOffsets {
  topic: string;
  partitions: PartitionOffset[];
}

export interface Offsets {
  topics: TopicOffsets[];
}

export interface Message {
  key?: Buffer | string | null;
  value: Buffer | string | null;
  partition?: number;
  headers?: IHeaders;
  timestamp?: string;
}

export interface IHeaders {
  [key: string]: Buffer | string | undefined;
}

export interface ConsumerConfig {
  groupId: string;
  partitionAssigners?: PartitionAssigner[];
  metadataMaxAge?: number;
  sessionTimeout?: number;
  rebalanceTimeout?: number;
  heartbeatInterval?: number;
  maxBytesPerPartition?: number;
  minBytes?: number;
  maxBytes?: number;
  maxWaitTimeInMs?: number;
  retry?: RetryOptions & {
    restartOnFailure?: (err: Error) => Promise<boolean>;
  };
  allowAutoTopicCreation?: boolean;
  maxInFlightRequests?: number;
  readUncommitted?: boolean;
  rackId?: string;
}

export type PartitionAssigner = (config: { cluster: Cluster }) => Assigner;
export interface PartitionerArgs {
  topic: string;
  partitionMetadata: PartitionMetadata[];
  message: Message;
}

export type ICustomPartitioner = () => (args: PartitionerArgs) => number;
export type PartitionMetadata = {
  partitionErrorCode: number;
  partitionId: number;
  leader: number;
  replicas: number[];
  isr: number[];
  offlineReplicas?: number[];
};

export type Logger = {
  // Ordered from least-severe to most-severe.
  debug(message?: any): void;
  info(message?: any): void;
  warn(message?: any): void;
  error(message?: any): void;
};

export enum CompressionTypes {
  None = 0,
  GZIP = 1,
  Snappy = 2,
  LZ4 = 3,
  ZSTD = 4,
}

export type Assignment = { [topic: string]: number[] };

export type GroupMember = { memberId: string; memberMetadata: Buffer };

export type GroupMemberAssignment = {
  memberId: string;
  memberAssignment: Buffer;
};

export type GroupState = { name: string; metadata: Buffer };

export type Assigner = {
  name: string;
  version: number;
  assign(group: {
    members: GroupMember[];
    topics: string[];
  }): Promise<GroupMemberAssignment[]>;
  protocol(subscription: { topics: string[] }): GroupState;
};

export interface RetryOptions {
  maxRetryTime?: number;
  initialRetryTime?: number;
  factor?: number;
  multiplier?: number;
  retries?: number;
}

export interface AdminConfig {
  retry?: RetryOptions;
}

export type ConsumerSubscribeTopic = {
  topic: string | RegExp;
  fromBeginning?: boolean;
};

export type Consumer = {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(topic: ConsumerSubscribeTopic): Promise<void>;
  stop(): Promise<void>;
  run(config?: ConsumerRunConfig): Promise<void>;
  commitOffsets(
    topicPartitions: Array<TopicPartitionOffsetAndMetadata>
  ): Promise<void>;
  seek(topicPartition: {
    topic: string;
    partition: number;
    offset: string;
  }): void;
  describeGroup(): Promise<GroupDescription>;
  pause(topics: Array<{ topic: string; partitions?: number[] }>): void;
  paused(): TopicPartitions[];
  resume(topics: Array<{ topic: string; partitions?: number[] }>): void;
  on(
    eventName: ValueOf<ConsumerEvents>,
    listener: (...args: any[]) => void
  ): RemoveInstrumentationEventListener<typeof eventName>;
  logger(): Logger;
  events: ConsumerEvents;
};
export type TopicPartitions = { topic: string; partitions: number[] };
export type TopicPartitionOffsetAndMetadata = {
  topic: string;
  partition: number;
  offset: string;
  metadata?: string | null;
};

// TODO: Remove with 2.x
export type TopicPartitionOffsetAndMedata = TopicPartitionOffsetAndMetadata;

// See https://github.com/apache/kafka/blob/2.4.0/clients/src/main/java/org/apache/kafka/common/ConsumerGroupState.java#L25
export type ConsumerGroupState =
  | 'Unknown'
  | 'PreparingRebalance'
  | 'CompletingRebalance'
  | 'Stable'
  | 'Dead'
  | 'Empty';

export type GroupDescription = {
  groupId: string;
  members: MemberDescription[];
  protocol: string;
  protocolType: string;
  state: ConsumerGroupState;
};

export type GroupDescriptions = {
  groups: GroupDescription[];
};
export type MemberDescription = {
  clientHost: string;
  clientId: string;
  memberId: string;
  memberAssignment: Buffer;
  memberMetadata: Buffer;
};
export type ConsumerEachBatchPayload = EachBatchPayload;

export type ConsumerRunConfig = {
  autoCommit?: boolean;
  autoCommitInterval?: number | null;
  autoCommitThreshold?: number | null;
  eachBatchAutoResolve?: boolean;
  partitionsConsumedConcurrently?: number;
  eachBatch?: (payload: EachBatchPayload) => Promise<void>;
  eachMessage?: (payload: EachMessagePayload) => Promise<void>;
};
export interface OffsetsByTopicPartition {
  topics: TopicOffsets[];
}

export interface EachMessagePayload {
  topic: string;
  partition: number;
  message: KafkaMessage;
}

export interface EachBatchPayload {
  batch: Batch;
  resolveOffset(offset: string): void;
  heartbeat(): Promise<void>;
  commitOffsetsIfNecessary(offsets?: Offsets): Promise<void>;
  uncommittedOffsets(): OffsetsByTopicPartition;
  isRunning(): boolean;
  isStale(): boolean;
}
export type ConsumerEvents = {
  HEARTBEAT: 'consumer.heartbeat';
  COMMIT_OFFSETS: 'consumer.commit_offsets';
  GROUP_JOIN: 'consumer.group_join';
  FETCH_START: 'consumer.fetch_start';
  FETCH: 'consumer.fetch';
  START_BATCH_PROCESS: 'consumer.start_batch_process';
  END_BATCH_PROCESS: 'consumer.end_batch_process';
  CONNECT: 'consumer.connect';
  DISCONNECT: 'consumer.disconnect';
  STOP: 'consumer.stop';
  CRASH: 'consumer.crash';
  RECEIVED_UNSUBSCRIBED_TOPICS: 'consumer.received_unsubscribed_topics';
  REQUEST: 'consumer.network.request';
  REQUEST_TIMEOUT: 'consumer.network.request_timeout';
  REQUEST_QUEUE_SIZE: 'consumer.network.request_queue_size';
};

export type Batch = {
  topic: string;
  partition: number;
  highWatermark: string;
  messages: KafkaMessage[];
  isEmpty(): boolean;
  firstOffset(): string | null;
  lastOffset(): string;
  offsetLag(): string;
  offsetLagLow(): string;
};

export type Cluster = {
  isConnected(): boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  refreshMetadata(): Promise<void>;
  refreshMetadataIfNecessary(): Promise<void>;
  addTargetTopic(topic: string): Promise<void>;
  findBroker(node: { nodeId: string }): Promise<any>;
  findControllerBroker(): Promise<any>;
  findTopicPartitionMetadata(topic: string): PartitionMetadata[];
  findLeaderForPartitions(
    topic: string,
    partitions: number[]
  ): { [leader: string]: number[] };
  findGroupCoordinator(group: { groupId: string }): Promise<any>;
  findGroupCoordinatorMetadata(group: {
    groupId: string;
  }): Promise<CoordinatorMetadata>;
  defaultOffset(config: { fromBeginning: boolean }): number;
  fetchTopicsOffset(
    topics: Array<
      {
        topic: string;
        partitions: Array<{ partition: number }>;
      } & XOR<{ fromBeginning: boolean }, { fromTimestamp: number }>
    >
  ): Promise<{
    topic: string;
    partitions: Array<{ partition: number; offset: string }>;
  }>;
};
export interface CoordinatorMetadata {
  errorCode: number;
  coordinator: {
    nodeId: number;
    host: string;
    port: number;
  };
}
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;
