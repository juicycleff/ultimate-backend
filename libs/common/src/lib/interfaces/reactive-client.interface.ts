import { Deferred } from '../utils';

export interface IReactiveClient<C> {
  client: Promise<C>;
  deferredClient: Deferred<C>;

  connect(opts: any, client: C): Promise<any>;

  close(): Promise<void>;

  createClient(opts: any): Promise<C>;
}
