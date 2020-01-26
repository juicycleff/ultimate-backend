import { Test, TestingModule } from '@nestjs/testing';
import { NestCasbinModule } from 'nestjs-casbin-mongodb';
import { resolve } from 'path';
import { RolesResolver } from './roles.resolver';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

describe('RolesResolver', () => {
  let resolver: RolesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestCasbinModule.forRootAsync(
          global.__MONGO_URI__ || AppConfig.casbin.dbUri,
          resolve('models/roles.conf'),
          global.__MONGO_DB_NAME__ || AppConfig.casbin.dbName,
          'roles',
        ),
      ],
      providers: [RolesResolver],
    }).compile();

    resolver = module.get<RolesResolver>(RolesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
