import { EventEmitter } from 'events';
import * as ConsulStatic from 'consul';
import * as retry from 'retry';
import {
  Deferred,
  IReactiveClient,
  LoggerUtil,
} from '@ultimate-backend/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConsulModuleOptions } from './consul-module.options';
import { CONSUL_MODULE_OPTIONS } from './consul.constant';

@Injectable()
export class Consul
  extends EventEmitter
  implements IReactiveClient<ConsulStatic.Consul>, OnModuleInit {
  logger = new LoggerUtil('Consul');

  client: Promise<ConsulStatic.Consul>;
  deferredClient: Deferred<ConsulStatic.Consul>;
  consulOptions?: ConsulStatic.ConsulOptions;

  /**
   * Creates an instance of ConsulStatic.
   * @memberof Consul
   */
  constructor(
    @Inject(CONSUL_MODULE_OPTIONS)
    public readonly options: ConsulModuleOptions
  ) {
    super();
    this.consulOptions = options;
    this.deferredClient = new Deferred<ConsulStatic.Consul>();
    this.client = this.deferredClient.promise;
    this.logger = new LoggerUtil('Consul', this.options.debug);
    this.connect(options);
  }

  /**
   * Connect to the consul
   *
   * @param opts
   * @param [client] Optional instantiated MongoDB connection
   * @memberof DatabaseClient
   */
  async connect(
    opts: ConsulStatic.ConsulOptions,
    client?: ConsulStatic.Consul | Promise<ConsulStatic.Consul>
  ): Promise<ConsulStatic.Consul> {
    this.consulOptions = opts;

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
    opts?: ConsulStatic.ConsulOptions,
    client?: ConsulStatic.Consul | Promise<ConsulStatic.Consul>
  ): Promise<ConsulStatic.Consul> {
    return new Promise<ConsulStatic.Consul>((resolve, reject) => {
      const operation = retry.operation();
      operation.attempt(async () => {
        try {
          const client = await ConsulStatic(opts);
          this.emit('connected', client);
          this.logger.debug('Consul client connected successfully');
          resolve(client);
        } catch (e) {
          this.logger.error(e);
          if (operation.retry(e)) {
            return;
          }
          this.emit('error', e);
          reject(e);
        }
      });
    });
  }

  async onModuleInit() {
    this.logger = new LoggerUtil('Consul', this.options.debug);
    this.logger.debug('Consul connecting');
    await this.connect(this.options);
  }
}
