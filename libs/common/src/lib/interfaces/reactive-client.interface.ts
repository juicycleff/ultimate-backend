export interface IReactiveClient<C> {
  connect(opts: any, client: C): Promise<any>;

  close(): void | Promise<void>;
}

export interface BaseClientOptions {
  debug?: boolean;
  retryAttempts?: number;
  retryDelays?: number;
}
