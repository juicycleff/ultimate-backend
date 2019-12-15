import { Global, Module } from '@nestjs/common';
import { NestCasbinModule } from 'nestjs-casbin-mongodb';
import { resolve } from 'path';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

@Global()
@Module({
  imports: [
    NestCasbinModule.forRootAsync(
      AppConfig.casbin.dbUri,
      resolve('models/roles.conf'),
      AppConfig.casbin.dbName,
      'roles',
    ),
  ],
})
export class CasbinRoleModule {}
