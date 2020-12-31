import { Linter } from 'tslint';

export enum UBkind {
  api,
  svc,
  faas,
}

export enum UBLanguages {
  typescript,
  golang,
  rustlang,
}

export enum UBTransport {
  grpc,
  rest,
  websocket,
}

export interface Schema {
  interactive: boolean;
  name: string;
  language: UBLanguages;
  kind: UBkind;
  transport: UBTransport;
  tags?: string;
  linter: Linter;
}
