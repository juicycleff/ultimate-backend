import { EventEmitter } from 'events';
import * as Consul from 'consul';
import * as retry from 'retry';
import { Deferred, IReactiveClient } from '@ultimate-backend/common';

export class ConsulClient extends EventEmitter implements IReactiveClient<Consul.Consul>{
  client: Promise<Consul.Consul>;
  deferredClient: Deferred<Consul.Consul>;
  private opts?: Consul.ConsulOptions;

  /**
   * Creates an instance of ConsulClient.
   * @memberof ConsulClient
   */
  constructor() {
    super();
    this.deferredClient = new Deferred<Consul.Consul>();
    this.client = this.deferredClient.promise;
  }

  /**
   * Connect to the consul
   *
   * @param opts
   * @param [client] Optional instantiated MongoDB connection
   * @memberof DatabaseClient
   */
  async connect(
    opts: Consul.ConsulOptions,
    client?: Consul.Consul | Promise<Consul.Consul>,
  ): Promise<Consul.Consul> {
    this.opts = opts;

    if (client !== undefined) {
      this.deferredClient.resolve(client);
    } else {
      this.deferredClient.resolve(this.createClient(opts));
    }
    return this.client;
  }

  /**
   * Close the connection
   * @memberof DatabaseClient
   */
  async close(): Promise<void> {
    // const client = await this.client;
  }

  /**
   * Create a connection to the Consul instance
   * Will retry if connection fails initially
   *
   * @private
   * @memberof DatabaseClient
   * @param opts
   * @param client
   */
  createClient(
    opts?: Consul.ConsulOptions,
    client?: Consul.Consul | Promise<Consul.Consul>,
  ): Promise<Consul.Consul> {
    return new Promise<Consul.Consul>((resolve, reject) => {
      const operation = retry.operation();
      operation.attempt(async () => {
        try {
          const client = await Consul(opts);
          this.emit('connected', client);
          resolve(client);
        } catch (e) {
          if (operation.retry(e)) {
            return;
          }
          this.emit('error', e);
          reject(e);
        }
      });
    });
  }
}
