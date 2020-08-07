import { Injectable, Scope } from '@nestjs/common';
import {
  ConnectionNotFoundError,
  TimeoutError as PromiseTimeoutError,
  HealthIndicatorResult,
  TimeoutError,
  HealthIndicator,
} from '@nestjs/terminus';
import { MongoClient } from 'mongodb';
import { ModuleRef } from '@nestjs/core';
import { checkPackages, promiseTimeout } from '@nestjs/terminus/dist/utils';
import { HealthCheckError } from '@godaddy/terminus';
import { getClientToken } from '@juicycleff/repo-orm';

export interface MongoPingCheckSettings {
  /**
   * The connection which the ping check should get executed
   */
  connection?: any;
  /**
   * The amount of time the check should require in ms
   */
  timeout?: number;
}

@Injectable({ scope: Scope.TRANSIENT })
export class MongoHealthIndicator extends HealthIndicator {
  constructor(private moduleRef: ModuleRef) {
    super();
    this.checkDependantPackages();
  }

  /**
   * Checks if the dependant packages are present
   */
  private checkDependantPackages() {
    checkPackages(['mongodb'], this.constructor.name);
  }
  /**
   * Returns the connection of the current DI context
   */
  private getContextConnection(): any | null {
    try {
      return this.moduleRef.get(getClientToken(), {
        strict: false,
      });
    } catch (err) {
      return null;
    }
  }

  private async pingDb(connection: MongoClient, timeout: number) {
    const promise = connection.isConnected()
      ? Promise.resolve()
      : Promise.reject();
    return await promiseTimeout(timeout, promise);
  }

  public async pingCheck(
    key: string,
    options: MongoPingCheckSettings = {},
  ): Promise<HealthIndicatorResult> {
    let isHealthy = false;
    this.checkDependantPackages();

    const connection: MongoClient =
      options.connection || this.getContextConnection();
    const timeout = options.timeout || 1000;

    if (!connection) {
      throw new ConnectionNotFoundError(
        this.getStatus(key, isHealthy, {
          message: 'Connection provider not found in application context',
        }),
      );
    }

    try {
      await this.pingDb(connection, timeout);
      isHealthy = true;
    } catch (err) {
      if (err instanceof PromiseTimeoutError) {
        throw new TimeoutError(
          timeout,
          this.getStatus(key, isHealthy, {
            message: `timeout of ${timeout}ms exceeded`,
          }),
        );
      }
    }

    if (isHealthy) {
      return this.getStatus(key, isHealthy);
    } else {
      throw new HealthCheckError(
        `${key} is not available`,
        this.getStatus(key, isHealthy),
      );
    }
  }
}
