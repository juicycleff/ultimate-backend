import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '@graphqlcqrs/core';
import { ProjectResolver } from './project.resolver';
import { ProjectRepository } from '@graphqlcqrs/repository';
import { MongoModule, MultiTenantModule, MultiTenantService } from '@juicycleff/nest-multi-tenant';

describe('ProjectResolver', () => {
  let resolver: ProjectResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CoreModule,
        MongoModule.forRootAsync({
          config: {
            serviceName: 'service-point',
            dbUri: global.__MONGO_URI__,
            dbName: global.__MONGO_DB_NAME__,
          },
          imports: [MultiTenantModule],
          useClass: MultiTenantService,
        }),
      ],
      providers: [ProjectResolver, ProjectRepository],
    }).compile();

    resolver = module.get<ProjectResolver>(ProjectResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
