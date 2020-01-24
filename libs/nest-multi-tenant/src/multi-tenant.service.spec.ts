import { Test, TestingModule } from '@nestjs/testing';
import { MultiTenantService } from './multi-tenant.service';

describe('NestMultiTenantService', () => {
  let service: MultiTenantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'DefaultDatabaseTenantConfig',
          useValue: {
            dbName: 'testdb',
            dbUri: 'mongodb"//localhost:27017/',
            serviceName: 'test-suit',
          },
        },
        MultiTenantService,
      ],
    }).compile();

    service = await module.resolve<MultiTenantService>(MultiTenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
