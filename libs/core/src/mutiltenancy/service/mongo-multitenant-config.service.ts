import { MongoModuleOptions, MongoOptionsFactory } from '@juicycleff/repo-orm';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CONTEXT } from '@nestjs/graphql';
import { ConsulDatabaseConfig } from '@ultimatebackend/common';
import { InjectConfig } from '@nestcloud/config';
import { EtcdConfig } from '@nestcloud/config/etcd-config';
import { Metadata } from 'grpc';
import { RequestContextHost } from '@nestjs/microservices/context/request-context-host';
import { TenantDatabaseStrategy, TenantInfo } from '../';
import { RpcException } from '@nestjs/microservices';
import { TenantEntity } from '@ultimatebackend/repository';

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
    @Inject(CONTEXT) private readonly context: RequestContextHost,
    @InjectConfig() private readonly config: EtcdConfig,
  ) {}

  createMongoOptions(): Promise<MongoModuleOptions> | MongoModuleOptions {
    const database = this.config.get<ConsulDatabaseConfig>('database');
    const metadata: Metadata = this.context.getContext();
    const gmap = metadata.getMap();
    let tenantInfo: TenantInfo = null;
    let tenant: TenantEntity = null;

    if (gmap['x-tenant-info']) {
      tenantInfo = JSON.parse(gmap['x-tenant-info'] as string);
    }

    if (gmap['x-tenant']) {
      tenant = JSON.parse(gmap['x-tenant'] as string);
    }

    const uriWithName = database.mongodb.uri.endsWith('/')
      ? `${database.mongodb.uri}${database.mongodb.name}${database.mongodb.options}`
      : `${database.mongodb.uri}/${database.mongodb.name}${database.mongodb.options}`;
    /**
     * This block of code is the default config if for some reason, the req object is empty
     */
    if (tenantInfo === null || !tenantInfo.config.enabled) {
      return {
        uri: uriWithName,
        dbName: database.mongodb.name,
        clientOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      };
    }

    if (!tenantInfo.tenantId) {
      throw new RpcException('Tenant name must be provided');
    }

    /**
     * We resolve a valid Mongo connection string
     */
    let uri = database.mongodb.uri; // Set database Url
    const appConString = this.resolveMongoUriString(
      database.mongodb.uri,
      tenantInfo.tenantId,
      database.mongodb.options,
    );
    let databaseName = database.mongodb.name;

    /**
     * Applying the right connection string for DatabaseIsolation database strategy
     */
    if (
      tenantInfo.config.databaseStrategy ===
      TenantDatabaseStrategy.DatabaseIsolation
    ) {
      databaseName = 'tenant-' + tenantInfo.tenantId;
      if (tenant && tenant?.settings?.database?.host) {
        uri = tenant?.settings?.database?.host;
      } else {
        uri = appConString;
      }
    }

    /**
     * Applying the right connection string for both DatabaseIsolation and DataIsolation database strategy
     */
    if (tenantInfo.config.databaseStrategy === TenantDatabaseStrategy.Both) {
      if (tenant && tenant?.settings?.database?.host) {
        databaseName = 'tenant-' + tenantInfo.tenantId;
        uri = tenant?.settings?.database?.host || appConString;
      } else {
        databaseName = database.mongodb.name;
        uri = uriWithName;
      }
    }

    /**
     * Applying the right connection string for DataIsolation database strategy
     */
    if (
      tenantInfo.config.databaseStrategy ===
      TenantDatabaseStrategy.DataIsolation
    ) {
      databaseName = database.mongodb.name;
      uri = this.resolveMongoUriString(
        database.mongodb.uri,
        database.mongodb.name,
        database.mongodb.options,
      );
    }

    /**
     * Return the final db configuration to the module
     */
    return {
      uri,
      dbName: databaseName,
      clientOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      tenantName: tenantInfo.tenantId ?? '*',
    };
  }

  /**
   * @description Generates correct mongo uri string
   * @param uri
   * @param databaseName
   * @param replicaName
   */
  private resolveMongoUriString(
    uri: string,
    databaseName: string,
    replicaName: string = null,
  ): string {
    if (uri === null || databaseName === null) {
      throw new RpcException(
        'A missing database uri and name in a multi tenant service',
      );
    }
    if (uri === undefined || databaseName === undefined) {
      throw new RpcException(
        'A missing database uri and a name in multi tenant service',
      );
    }

    return uri.endsWith('/')
      ? `${uri}${databaseName}${
          replicaName ? '?replicaSet=' + replicaName : ''
        }`
      : `${uri}/${databaseName}${
          replicaName ? '?replicaSet=' + replicaName : ''
        }`;
  }
}
