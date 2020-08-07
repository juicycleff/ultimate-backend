import { EventEmitter } from 'events';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import * as retry from 'retry';

import { Deferred } from '../../utils';

export class MongoDatabaseClient extends EventEmitter {
  client: Promise<MongoClient>;
  db: Promise<Db>;

  private uri: string;
  private deferredClient: Deferred<MongoClient>;
  private deferredDb: Deferred<Db>;

  /**
   * Creates an instance of DatabaseClient.
   * @memberof DatabaseClient
   */
  constructor() {
    super();
    this.deferredClient = new Deferred<MongoClient>();
    this.client = this.deferredClient.promise;

    this.deferredDb = new Deferred<Db>();
    this.db = this.deferredDb.promise;
  }

  /**
   * Connect to the mongodb
   *
   * @param uri The uri of the MongoDB instance
   * @param [userOpts] Optional options for your MongoDb connection
   * @param [client] Optional instantiated MongoDB connection
   * @memberof DatabaseClient
   */
  async connect(
    uri: string,
    userOpts?: MongoClientOptions,
    client?: MongoClient | Promise<MongoClient>,
  ): Promise<Db> {
    this.uri = uri;

    if (client !== undefined) {
      this.deferredClient.resolve(client);
    } else {
      this.deferredClient.resolve(this.createClient(this.uri, userOpts));
    }

    this.deferredDb.resolve((await this.client).db());
    return this.db;
  }

  /**
   * Close the connection
   * @memberof DatabaseClient
   */
  async close(): Promise<void> {
    const client = await this.client;
    return client.close();
  }

  /**
   * Create a connection to the MongoDB instance
   * Will retry if connection fails initially
   *
   * @private
   * @param uri
   * @param userOpts
   * @memberof DatabaseClient
   */
  private createClient(
    uri: string,
    userOpts?: MongoClientOptions,
  ): Promise<MongoClient> {
    return new Promise<MongoClient>((resolve, reject) => {
      const operation = retry.operation();
      const opts = Object.assign({}, { useNewUrlParser: true }, userOpts);
      operation.attempt(async (attempt) => {
        try {
          const client = await MongoClient.connect(uri, opts);
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
