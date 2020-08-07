import { EventEmitter } from 'events';
import { Database } from 'arangojs';
import { Config as ArangoConfig } from 'arangojs/lib/async/connection';
import * as retry from 'retry';

import { Deferred } from '../../utils';
import { ARANGO_DEFAULTS } from './arango.constants';
import { EVENTS_CONSTANTS } from '../../constants/events.constants';
import { ArangoClientOption } from './interfaces';

export class ArangoDatabaseClient extends EventEmitter {
  database: Promise<Database>;

  private deferredDatabase: Deferred<Database>;
  private url: string | string[];
  private password: string;
  private username: string;
  private name: string;
  private connected: boolean;

  /**
   * Creates an instance of DatabaseClient.
   * @memberof DatabaseClient
   */
  constructor() {
    super();

    this.deferredDatabase = new Deferred<Database>();
    this.database = this.deferredDatabase.promise;
  }

  /**
   * Connect to the mongodb
   *
   * @param name
   * @param options
   * @param db
   * @memberof DatabaseClient
   */
  async connect(
    name: string = ARANGO_DEFAULTS.DATABASE,
    options: ArangoClientOption,
    db?: Database,
  ): Promise<Database> {
    if (typeof options === 'string' || Array.isArray(options)) {
      throw Error('Options must not be a string');
    }

    this.name = name;
    this.url = options.url || ARANGO_DEFAULTS.URL;
    this.username = options.username || ARANGO_DEFAULTS.USERNAME;
    this.password = options.password || ARANGO_DEFAULTS.PASSWORD;

    if (db !== undefined) {
      this.deferredDatabase.resolve(db);
    } else {
      this.deferredDatabase.resolve(await this.createDatabase(name, options));
    }

    return this.database;
  }

  /**
   * Close the connection
   * @memberof DatabaseClient
   */
  async close(): Promise<void> {
    const client = await this.database;
    return client.close();
  }

  /**
   * Create a connection to the MongoDB instance
   * Will retry if connection fails initially
   *
   * @private
   * @memberof DatabaseClient
   * @param name
   * @param option
   */
  private createDatabase(
    name: string,
    option: ArangoConfig,
  ): Promise<Database> {
    return new Promise<Database>((resolve, reject) => {
      const operation = retry.operation();
      operation.attempt(async (attempt) => {
        try {
          const db = new Database(option);
          db.useDatabase(name);

          if (
            this.username !== ARANGO_DEFAULTS.USERNAME ||
            this.password !== ARANGO_DEFAULTS.PASSWORD
          ) {
            await db.login(this.username, this.password);
          }

          this.connected = await db.exists();
          if (this.connected) {
            this.emit(EVENTS_CONSTANTS.CONNECTED, db);
          }
          resolve(db);
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
