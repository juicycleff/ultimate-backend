import { Cursor } from 'mongodb';

export const COLLECTION_KEY = 'collection';
export const ENTITY_KEY = 'entity';
export const COLUMN_KEY = 'column';
export const PRE_KEY = 'pre';
export const POST_KEY = 'post';

export interface UpdateByIdRequest {
  updates: any;
  upsert?: boolean;
}

export interface UpdateRequest extends UpdateByIdRequest {
  conditions: any;
}

export interface FindRequest {
  conditions: any;
  limit?: number;
  projection?: any;
  sort?: any;
  skip?: number;
}

export interface PageInfoOffsets {
  before: string | null;
  after: string | null;
  first: number | null;
  last: number | null;
  afterOffset: number;
  beforeOffset: number;
  startOffset: number;
  endOffset: number;
  startCursorOffset: number;
  endCursorOffset: number;
}

export type Offsets = PageInfoOffsets & {
  skip: number;
  limit: number;
};

/**
 * An flow type alias for cursors in this implementation.
 */
export type ConnectionCursor = string;

/**
 * A flow type describing the arguments a connection field receives in GraphQL.
 */
export interface ConnectionArguments {
  before?: ConnectionCursor | null;
  after?: ConnectionCursor | null;
  first?: number | null;
  last?: number | null;
}

export interface CursorPaginationRequest {
  conditions: any;
  args?: ConnectionArguments;
  projection?: any;
  sort?: any;
  orderField?: string;
  order?: number;
}

export interface CollectionProps {
  name: string;
  capped?: boolean;
  size?: number;
  max?: number;
  supportTenant?: boolean;
  caching?: boolean;
}

export interface EntityProps {
  name?: string;
  supportTenant?: boolean;
}

export interface IndexDefinition {
  // The fields to index on
  fields: { [fieldName: string]: string | any };
  // overwrite the index if it exists and isn't the same
  overwrite?: boolean;
}

export interface TenantData {
  tenantId?: string;
}

export interface CursorInfo {
  endCursor?: string;
  hasNextPage?: boolean;
  startCursor?: string;
  hasPreviousPage?: boolean;
}

export interface TotalCountOptions {
  cursor: Cursor<any>;
}

export class CursorEdge<T> {
  node: T;
  cursor: string;
}

export class CursorResponse<T> {
  edges?: Array<CursorEdge<T>>;
  list?: T[];
  pageInfo?: CursorInfo;
  totalCount?: number;
}

export type PageInfoOptions<T> = PageInfoOffsets & {
  edges: Array<{
    cursor: string;
    node: T;
  }>;
  totalCount: number;
};

export interface OffsetOptions {
  // Connection Args
  args: ConnectionArguments;
  // total Count
  totalCount: number;
}
