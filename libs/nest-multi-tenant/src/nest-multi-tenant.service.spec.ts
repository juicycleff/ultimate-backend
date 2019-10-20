import { Test, TestingModule } from '@nestjs/testing';
import { NestMultiTenantService } from './nest-multi-tenant.service';

describe('NestMultiTenantService', () => {
  let service: NestMultiTenantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NestMultiTenantService],
    }).compile();

    service = await module.resolve<NestMultiTenantService>(NestMultiTenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
