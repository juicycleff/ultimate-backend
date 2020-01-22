import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CONTEXT } from '@nestjs/graphql';
import { TenantInfo, TenantDatabaseStrategy, MongoModuleOptions, ITenantServiceConfig } from './';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

/**
 * @class MultiTenantService
 */
@Injectable({ scope: Scope.REQUEST })
export class MultiTenantService {

  /**
   * @description All this params are injected
   * @param request
   * @param context
   * @param tenantServiceConfig
   */
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(CONTEXT) private readonly context,
    @Inject('DefaultDatabaseTenantConfig') private readonly tenantServiceConfig: ITenantServiceConfig,
  ) {}

  async createMongoOptions(): Promise<MongoModuleOptions> {
    let req = null;

    if (this.context) {
      req = this.context.req;
    } else {
      req = this.request;
    }

    const dbUri = this.tenantServiceConfig.dbUri; // Set database Url
    const dbUriWithName = this.tenantServiceConfig.dbUri.endsWith('/') ?
      `${this.tenantServiceConfig.dbUri}${this.tenantServiceConfig.dbUri}` :
      `${this.tenantServiceConfig.dbUri}/${this.tenantServiceConfig.dbUri}`;

    /**
     * This piece block of code is the default config if for some reason, the req object is empty
     */
    if (req === null || req === undefined) {
      return {
        uri: dbUriWithName,
        dbName: this.tenantServiceConfig.dbName,
        clientOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      };
    }

    /**
     * Get the tenant info json string from the header and parse it into an object
     */
    let tenantFromHeader = req.headers['x-tenant-info'];
    if (tenantFromHeader) {
      tenantFromHeader = JSON.parse(req.headers['x-tenant-info']);
    }
    // @ts-ignore
    const tenantInfo = tenantFromHeader as TenantInfo;
    let uri = dbUri;

    /**
     * If for rats ass the tenantInfo object is empty, return a default configuration
     */
    if (tenantInfo === null || tenantInfo === undefined || !tenantInfo.config.enabled) {
      return {
        uri: dbUriWithName,
        dbName: this.tenantServiceConfig.dbName,
        clientOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      };
    }

    /**
     * We generate a valid Mongo connection string
     */
    const appConString = this.generateMongoConnectionString(
      this.tenantServiceConfig.dbUri, tenantInfo.tenant, this.tenantServiceConfig.dbReplicaOptions);

    /**
     * Applying the right connection string for DatabaseIsolation database strategy
     */
    if (tenantInfo.config.databaseStrategy === TenantDatabaseStrategy.DatabaseIsolation) {
      if (tenantInfo.connectionString) {
        uri = tenantInfo.connectionString;
      } else {
        uri = appConString || (dbUri + tenantInfo.tenant);
      }
    }

    /**
     * Applying the right connection string for both DatabaseIsolation and DataIsolation database strategy
     */
    let tenantName;
    if (tenantInfo.config.databaseStrategy === TenantDatabaseStrategy.Both) {
      if (tenantInfo.connectionString) {
        uri = tenantInfo.connectionString || appConString || dbUriWithName;
      } else {
        uri = dbUriWithName;
        tenantName = tenantInfo.tenant;
      }
    }

    /**
     * Applying the right connection string for DataIsolation database strategy
     */
    if (tenantInfo.config.databaseStrategy === TenantDatabaseStrategy.DataIsolation) {
      uri = this.generateMongoConnectionString(
        this.tenantServiceConfig.dbUri, this.tenantServiceConfig.dbName, this.tenantServiceConfig.dbReplicaOptions);
    }

    /**
     * Return the final db configuration to the module
     */
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

  /**
   * @description Generates correct mongo uri string
   * @param uri
   * @param databaseName
   * @param replicaName
   */
  private generateMongoConnectionString(uri: string, databaseName: string, replicaName: string = null): string {
    if (uri === null || databaseName === null) { throw Error('A missing database uri and name in multi tenant service'); }
    if (uri === undefined || databaseName === undefined) { throw Error('A missing database uri and name in multi tenant service'); }

    return this.tenantServiceConfig.dbUri.endsWith('/') ?
      `${uri}${databaseName}${replicaName ? '?replicaSet=' + replicaName : ''}` :
      `${uri}/${databaseName}${replicaName ? '?replicaSet=' + replicaName : ''}`;
  }
}
