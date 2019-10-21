import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CONTEXT } from '@nestjs/graphql';
import { TenantInfo, TenantDatabaseStrategy, MongoModuleOptions } from './';

@Injectable({ scope: Scope.REQUEST })
export class NestMultiTenantService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(CONTEXT) private readonly context,
  ) {}

  async createMongoOptions(): Promise<MongoModuleOptions> {
    let req = null;

    if (this.context) {
      req = this.context.req;
    } else {
      req = this.request;
    }

    // @ts-ignore
    const tenantInfo = req.tenantInfo as TenantInfo;
    let uri = process.env.DATABASE_URI || 'mongodb://localhost/test';

    if (tenantInfo === null || tenantInfo === undefined) {
      return {
        uri: process.env.DATABASE_URI || 'mongodb://localhost/test',
        dbName: process.env.DATABASE_NAME || 'test',
        clientOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      };
    }

    if (!tenantInfo.config.enabled) {
      return {
        uri: process.env.DATABASE_URI || 'mongodb://localhost/test',
        dbName: process.env.DATABASE_NAME || 'test',
        clientOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      };
    }

    const appConString = this.generateMongoConnectionString(
      process.env.DATABASE_URI, tenantInfo.tenant, process.env.DATABASE_REPLICA_NAME);

    if (tenantInfo.config.databaseStrategy === TenantDatabaseStrategy.DatabaseIsolation) {
      if (tenantInfo.connectionString) {
        uri = tenantInfo.connectionString || appConString || 'mongodb://localhost/test';
      } else {
        uri = appConString || 'mongodb://localhost/' + tenantInfo.tenant;
      }
    }

    if (tenantInfo.config.databaseStrategy === TenantDatabaseStrategy.Both) {
      if (tenantInfo.connectionString) {
        uri = tenantInfo.connectionString || appConString || 'mongodb://localhost/test';
      }
    }

    return {
      uri,
      dbName: tenantInfo.tenant || 'ultimate-backend',
      clientOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    };
  }

  private generateMongoConnectionString(uri: string, databaseName: string, replicaName: string = null) {
    return `mongodb://${uri}/${databaseName}${replicaName ? '?replicaSet=' + replicaName : ''}`;
  }
}
