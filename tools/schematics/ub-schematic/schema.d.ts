import { Linter } from 'tslint';

export enum UBkind {
  api,
  svc,
  faas,
}

export enum UBTransport {
  grpc,
  rest,
  websocket,
}

export interface Schema {
  interactive: boolean;
  name: string;
  kind: UBkind;
  transport: UBTransport;
  tags?: string;
  linter: Linter;
}
