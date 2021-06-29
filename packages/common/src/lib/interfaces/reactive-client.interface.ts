export interface IReactiveClient<C> {
  connect(): Promise<any>;

  close(): void | Promise<void>;
}

export interface BaseClientOptions {
  debug?: boolean;
  retryAttempts?: number;
  retryDelays?: number;
}
