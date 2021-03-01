import { Injectable } from '@nestjs/common';
import { InjectConfig } from '@nestcloud/config';
import { KubernetesConfig } from '@nestcloud/config/config.kubernetes';
import { MongoModuleOptions, MongoOptionsFactory } from '@juicycleff/repo-orm';
import { SharedDatabaseConfig } from '@livents/common';

@Injectable()
export class MongoConfigService implements MongoOptionsFactory {
  constructor(@InjectConfig() private readonly config: KubernetesConfig) {}

  createMongoOptions(): Promise<MongoModuleOptions> | MongoModuleOptions {
    const database = this.config.get<SharedDatabaseConfig>('database');

    return {
      uri: `${database?.mongodb?.uri}${database?.mongodb?.name}`,
      dbName: database?.mongodb?.name,
    };
  }
}
