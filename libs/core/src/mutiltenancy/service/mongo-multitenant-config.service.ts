import { MongoModuleOptions, MongoOptionsFactory } from '@juicycleff/repo-orm';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CONTEXT } from '@nestjs/graphql';
import { ConsulDatabaseConfig } from '../../../../common/src/interfaces';
import { ConsulConfig, InjectConfig } from '@nestcloud/config';

@Injectable({ scope: Scope.REQUEST })
export class MongoMultiTenantConfigService implements MongoOptionsFactory {

  /**
   * @description All this params are injected
   * @param request
   * @param context
   * @param config
   */
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(CONTEXT) private readonly context,
    @InjectConfig() private readonly config: ConsulConfig,
  ) {}

  createMongoOptions(): Promise<MongoModuleOptions> | MongoModuleOptions {
    const database = this.config.get<ConsulDatabaseConfig>('database');
    let req = null;

    console.log(this.request);
    console.log(this.context);

    if (this.context) {
      req = this.context.req;
    } else {
      req = this.request;
    }

    /**
     * This piece block of code is the default config if for some reason, the req object is empty
     */
    if (req === null || req === undefined) {
      return {
        uri: database.mongodb.uri,
        dbName: database.mongodb.name,
        clientOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      };
    }
  }
}
