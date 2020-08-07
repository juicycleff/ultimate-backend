import { ConsulDatabaseConfig } from '@ultimatebackend/common';
import { NEST_CONFIG_PROVIDER } from '@nestcloud/common';
import { EtcdConfig } from '@nestcloud/config/etcd-config';
import { MongoAdapter } from 'casbin-mongodb-adapter';
import { CASBIN_CUSTOM_ADAPTER } from './constants';
import { Module, Provider } from '@nestjs/common';

const jestMongoDb = global.__MONGO_URI__
  ? `${global.__MONGO_URI__}/${global.__MONGO_DB_NAME__}`
  : undefined;

export const adapterProvider: Provider = {
  provide: CASBIN_CUSTOM_ADAPTER,
  useFactory: async (config: EtcdConfig) => {
    const casbin = config.get<ConsulDatabaseConfig>('database');
    let uri = casbin.mongodb.uri;
    uri = uri.slice(0, uri.length - 1);
    return await MongoAdapter.newAdapter({
      uri: jestMongoDb || uri,
      collectionName: 'casbin',
      databaseName: casbin.mongodb.name,
    });
  },
  inject: [NEST_CONFIG_PROVIDER],
};

@Module({
  providers: [adapterProvider],
  exports: [adapterProvider],
})
export class AdapterProviderModule {}
