import { Injectable } from '@nestjs/common';
import { InjectConfig } from '@nestcloud/config';
import { KubernetesConfig } from '@nestcloud/config/config.kubernetes';
import {
  ArangoModuleOptions,
  ArangoOptionsFactory,
} from '@juicycleff/repo-orm';
import { SharedDatabaseConfig } from '@livents/common';

@Injectable()
export class ArangoConfigService implements ArangoOptionsFactory {
  constructor(@InjectConfig() private readonly config: KubernetesConfig) {}

  createArangoOptions(): Promise<ArangoModuleOptions> | ArangoModuleOptions {
    const database = this.config.get<SharedDatabaseConfig>('database');

    return {
      dbName: '_system',
      clientOptions: {
        url: 'http://127.0.0.1:8529',
        password: 'tester',
        username: 'tester',
      },
    };
  }
}
