import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { NestCasbinModule } from 'nestjs-casbin-mongodb';
import { resolve } from 'path';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

describe('Roles Controller', () => {
  let controller: RolesController;

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
      controllers: [RolesController],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
