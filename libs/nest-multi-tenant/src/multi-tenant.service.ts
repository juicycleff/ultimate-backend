import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CONTEXT } from '@nestjs/graphql';
import { TenantInfo, TenantDatabaseStrategy, MongoModuleOptions } from './';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

@Injectable({ scope: Scope.REQUEST })
export class MultiTenantService {
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

    const dbUri = process.env.DATABASE_URI || AppConfig.services?.project?.mongodb?.uri;
    const dbUriWithName = (process.env.DATABASE_URI || AppConfig.services?.project?.mongodb?.uri) + AppConfig.services?.project?.mongodb?.name;

    if (req === null || req === undefined) {
      return {
        uri: process.env.DATABASE_URI || dbUriWithName,
        dbName: AppConfig.services?.project?.mongodb?.name,
        clientOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      };
    }

    let tenantFromHeader = req.headers['x-tenant-info'];
    if (tenantFromHeader) {
      tenantFromHeader = JSON.parse(req.headers['x-tenant-info']);
    }
    // @ts-ignore
    const tenantInfo = tenantFromHeader as TenantInfo;
    let uri = dbUri;

    if (tenantInfo === null || tenantInfo === undefined || !tenantInfo.config.enabled) {
      return {
        uri: dbUriWithName,
        dbName: process.env.DATABASE_NAME || AppConfig.services?.project?.mongodb?.name,
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
        uri = tenantInfo.connectionString || appConString || dbUriWithName;
      } else {
        uri = appConString || (dbUri + tenantInfo.tenant);
      }
    }

    let tenantName;
    if (tenantInfo.config.databaseStrategy === TenantDatabaseStrategy.Both) {
      if (tenantInfo.connectionString) {
        uri = tenantInfo.connectionString || appConString || dbUriWithName;
      } else {
        uri = process.env.DATABASE_URI || dbUriWithName;
        tenantName = tenantInfo.tenant;
      }
    }

    return {
      uri,
      dbName: tenantInfo.tenant || AppConfig.services?.project?.mongodb?.name,
      clientOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      tenantName,
    };
  }

  private generateMongoConnectionString(uri: string, databaseName: string, replicaName: string = null) {
    return `mongodb://${uri}/${databaseName}${replicaName ? '?replicaSet=' + replicaName : ''}`;
  }
}
