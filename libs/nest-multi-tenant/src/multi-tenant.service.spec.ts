import { Test, TestingModule } from '@nestjs/testing';
import { MultiTenantService } from './nest-multi-tenant.service';

describe('NestMultiTenantService', () => {
  let service: MultiTenantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MultiTenantService],
    }).compile();

    service = await module.resolve<MultiTenantService>(MultiTenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
