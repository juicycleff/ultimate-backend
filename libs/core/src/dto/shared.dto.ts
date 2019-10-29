/* tslint:disable */
export class Paginate {
  first?: number;
  offset?: number;
}

export interface Node {
  id: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export type DateTime = any;
export type JSON = any;
